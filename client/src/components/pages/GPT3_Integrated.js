
import React, { Component } from "react";
import OpenAIAPI from "react-openai-api";
import { LangModelAttributes } from "../../LangModel";
import { Shakespeare }  from "../../HumanModel";
import "../../utilities.css";
import "./Skeleton.css";


const maxTokens = 1000;
const maxResponseLen = 200;
const apiKey = "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"


export default class GPT3_Integrated extends Component {
    constructor(props) {
        super(props);
        this.languageModel = new LangModelAttributes(props.HumanModel, props.FirstName )
        this.firstName = this.languageModel.firstName 
        this.staticPrompt = this.languageModel.staticPrompt(undefined)
        this.state = {
            response: '',
            previous_prompts: [],
            prompt: '',
        }
    }

    tokenCount = (str) => { 
        let one_line_str = str.replace("\n", " ");
        return (one_line_str.length / 5);
      }


    generatePayload = () => {
        let combinedPrompts = (this.props.HumanModel == Shakespeare) ? this.languageModel.staticPrompt(this.state.prompt) : this.combinePrompts();
        console.log(`Full Prompt:\n${combinedPrompts}`)
        return this.languageModel.modelPayload(maxTokens, combinedPrompts)
    }

    responseHandler = (res) => {
        let entry = this.state.prompt + '\n' + res.choices[0].text
        this.setState({
            response: res.choices[0].text,
            previous_prompts: this.state.previous_prompts.concat([[this.tokenCount(entry), entry]])
        }, () => { 
            this.props.onResponse(this.state.response)
        } );
    }

    combinePrompts = () => {
        let combinedPrompts = "";
        let max_word_lim = maxTokens - this.tokenCount(this.staticPrompt) - this.tokenCount(this.state.prompt) - maxResponseLen;
        if (this.state.previous_prompts.length != 0) {
            for (let i = this.state.previous_prompts.length - 1; i >= 0; i--) {
                if (max_word_lim >= this.state.previous_prompts[i][0]) {
                    max_word_lim -= this.state.previous_prompts[i][0]
                    combinedPrompts = this.state.previous_prompts[i][1] + combinedPrompts
                } else {
                    let negSlice = i - this.state.previous_prompts.length + 1;
                    let new_previous_prompts = (negSlice== 0) ? [] : this.state.previous_prompts.slice(negSlice)
                    this.setState({
                        previous_prompts: new_previous_prompts,
                        response: ''
                    })
                    break;
                }
            }
        }
        let finalPrompt = this.staticPrompt + combinedPrompts + this.state.prompt + '\n'
        return finalPrompt;
    }

    onClickFun = (promptVal) => {
        this.setState({
            prompt:  this.languageModel.polishedInput(promptVal),
            response: undefined,
        }, () => this.props.onResponse('A passage about ' + promptVal + ':'));
    }

    newlineText = (res) => {
        const newText = res.split('\n').map(str => <p>{str}</p>);
        return newText;
      }

    render () {
        return (
            <div className="room form-block w-form" style={{visibility:this.props.visibility}}>
                <p>{(this.state.response == undefined) ? 
                                (<OpenAIAPI
                                apiKey={apiKey}
                                payload={this.generatePayload() }
                                start_sequence= {`\n${this.languageModel.humanModelName()}:`}
                                responseHandler={this.responseHandler}
                                />) 
                                : ""
                            }</p>
                <label className='field-label'>Receive Shakespeare&#x27;s writings on any topic.</label>
                <div className='div-block'>
                    <input type='text' className='text-field w-input row' maxLength={256} name='name' id='promptinput' placeholder='Enter a topic.'/>
                    <button onClick={() => this.onClickFun(document.getElementById("promptinput").value)} className='submit-button w-button row'>Enter</button>
                    <br></br>

                
                </div>
          </div>

    );
    };
}


