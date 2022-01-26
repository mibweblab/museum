
import React, { Component } from "react";
import OpenAIAPI from "react-openai-api";
import { LangModelAttributes, getTextAreaDescription } from "../../LangModel";
import { Shakespeare }  from "../../HumanModel";
import "../../utilities.css";
import "./../pages/Skeleton.js"
import APIInterface from "../../api/api";
const maxTokens = 1000;
const maxResponseLen = 200;
const apiKey = "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" //process.env.REACT_APP_OPEN_AI_KEY;


export default class GPT3_Integrated extends Component {
    constructor(props) {
        super(props);
        this.languageModel = new LangModelAttributes(props.HumanModel, props.FirstName, props.modelFirstName, props.modelLastName, props.modelDescription )
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
        // console.log(`Full Prompt:\n${combinedPrompts}`)
        return this.languageModel.modelPayload(maxTokens, combinedPrompts)
    }

    userFacingResponse = (response) => {
        const arr = this.languageModel.nameStringArr()
        const reducer = (previousValue, currentValue) => previousValue.replace(currentValue, '');
        const newResponse = (arr.reduce(reducer, response)).trim()
        return newResponse
    }

    fireRequest = async() => {
        const payload = this.generatePayload()
        const response = await APIInterface.sendGPT3Request(payload)
        const response_text = response.data.choices[0].text
        let entry = this.state.prompt + '\n' + response_text
        this.setState({
            response: response_text,
            previous_prompts: this.state.previous_prompts.concat([[this.tokenCount(entry), entry]]),
        }, () => { 
            const refinedResponse = this.userFacingResponse(this.state.response)
            this.props.onResponse( refinedResponse, false)
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

    onClickFun = (e) => {
        e.preventDefault();
        const promptVal = (document.getElementById("promptinput").value).trim();
        document.getElementById("promptinput").value = '';
        this.setState({
            prompt:  this.languageModel.polishedInputForGPT3(promptVal),
        }, () => {
            this.props.onPrompt(promptVal);
            this.fireRequest()
        });
    }

    newlineText = (res) => {
        const newText = res.split('\n').map(str => <p>{str}</p>);
        return newText;
      }

    
    labelName = () => {
        return getTextAreaDescription(this.props.HumanModel)
    }

    clearConvo = (e) => {
        e.preventDefault();
        document.getElementById("promptinput").value = '';
        this.setState({
            response: '',
            previous_prompts: [],
            prompt: '',
        }, ()=> this.props.onResponse(null, true))
    }

    render () {
        return (
            <div id='item2'>
                <div className='conversation-field-label' >
                    <label className=' h6 field-label pt-10'>{this.labelName()}</label>
                    <button onClick={(e) => this.clearConvo(e)}  className='converse-btn ' id='refresh'>Refresh</button>
                </div>
               
                <div className='conversation-textarea-div'>
                    <textarea onKeyPress={(e)=> { if (e.key === 'Enter') { this.onClickFun(e)} }} type='text' className=' text-field w-input row no-highlight' maxLength={256} name='name' id='promptinput' placeholder='Enter a topic.'/>
                    <button onClick={(e) => this.onClickFun(e)}  className='converse-btn'>Enter</button>
                </div>
          </div>
    );
    };
}


