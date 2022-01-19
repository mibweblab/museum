//temporary file
import React, { Component } from "react";
import OpenAIAPI from "react-openai-api";
import { LangModelAttributes, Einstein, Shakespeare } from "../../LangModel";
import "../../utilities.css";
import "./Skeleton.css";
import Speech from "./Speech";

const maxTokens = 1000;
const maxResponseLen = 200;
const apiKey = process.env.REACT_APP_OPEN_AI_KEY


export default class GPT3_playground extends Component {
  constructor(props) {
    super(props);
    this.languageModel = new LangModelAttributes(props.HumanModel, props.FirstName);
    this.firstName = this.languageModel.firstName;
    this.staticPrompt = this.languageModel.staticPrompt(undefined);
    // // for img input
    // const [imageAsFile, setimageAsFile] = useState('');
    // const [imageAsUrl, setimageAsUrl] = useState(allInputs)
    this.state = {
      response: "",
      previous_prompts: [],
      prompt: "-1",
    };
    // this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  tokenCount = (str) => {
    let one_line_str = str.replace("\n", " ");
    return one_line_str.length / 5;
  };

  generatePayload = () => {
    let combinedPrompts =
      this.props.HumanModel == Shakespeare
        ? this.languageModel.staticPrompt(this.state.prompt)
        : this.combinePrompts();
    console.log(`Full Prompt:\n${combinedPrompts}`);
    return this.languageModel.modelPayload(maxTokens, combinedPrompts);
  };

  responseHandler = (res) => {
    let entry = this.state.prompt + "\n" + res.choices[0].text;
    this.setState(
      {
        response: res.choices[0].text,
        previous_prompts: this.state.previous_prompts.concat([[this.tokenCount(entry), entry]]),
      },
      () => {
        console.log("here's your response");
        console.log(this.state.response);
      }
    );
  };

  combinePrompts = () => {
    let combinedPrompts = "";
    let max_word_lim =
      maxTokens -
      this.tokenCount(this.staticPrompt) -
      this.tokenCount(this.state.prompt) -
      maxResponseLen;
    if (this.state.previous_prompts.length != 0) {
      for (let i = this.state.previous_prompts.length - 1; i >= 0; i--) {
        if (max_word_lim >= this.state.previous_prompts[i][0]) {
          max_word_lim -= this.state.previous_prompts[i][0];
          combinedPrompts = this.state.previous_prompts[i][1] + combinedPrompts;
        } else {
          let negSlice = i - this.state.previous_prompts.length + 1;
          let new_previous_prompts =
            negSlice == 0 ? [] : this.state.previous_prompts.slice(negSlice);
          this.setState({
            previous_prompts: new_previous_prompts,
            response: "",
          });
          break;
        }
      }
    }
    let finalPrompt = this.staticPrompt + combinedPrompts + this.state.prompt + "\n";
    return finalPrompt;
  };

  onClickFun = (promptVal) => {
    this.setState({
      prompt: this.languageModel.polishedInput(promptVal),
      response: undefined,
    });
  };

  newlineText = (res) => {
    const newText = res.split("\n").map((str) => <p>{str}</p>);
    return newText;
  };

  //For hitting Enter
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("enter is pressed");
      //   render();
      // this.setState({ inputValue: this.state.response });
      // console.log(this.state.response);
    }
  };

  render() {
    return (
      <div className="Skeleton-container">
        <h1>{this.languageModel.title()}</h1>
        <input
          type="text"
          className="text-field w-input"
          maxLength="256"
          name="Question"
          data-name="Question"
          placeholder="Ask away."
          id="promptinput"
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={() => this.onClickFun(document.getElementById("promptinput").value)}>
          Enter
        </button>
        <div>{this.state.inputValue}</div>
        <br></br>
        <Speech response={this.state.response} />
        {this.state.response == undefined ? (
          <OpenAIAPI
            apiKey={apiKey}
            payload={this.generatePayload()}
            start_sequence={`\n${this.languageModel.humanModelName()}:`}
            responseHandler={this.responseHandler}
          />
        ) : (
          this.newlineText(this.state.response)
        )}
      </div>
    );
  }
}
