import React, { Component } from "react";
// import { World} from "../modules/RoomScenes/RoomScenes.js" ;  
import GPT3_Integrated from "./GPT3_Integrated.js";
import { Shakespeare, Einstein, Musk } from "../../HumanModel.js";
import { getIntro} from '../../LangModel.js'
import "./RoomScenes.css"
import Conversation from "./Conversation.js"

export default class Rooms extends Component{
  constructor(props) {
    super(props); 
    this.state = {
      isTextBoxVisible: "visible",
      conversation: [],
      question:[],
    };
  } 

  intro() {
    return getIntro(this.props.HumanModel)
  }

  onPrompt = async(promptText) => {
    const reactElArray = this.newlineText(promptText)
    this.setState({ question: reactElArray})

  }

  onResponse = async(responseText) => {
    console.log('I WAS CALLED')
    const reactElArray = this.newlineText(responseText)

    this.setState((state) => 
    {
        // fix me

        const temp = state.conversation.concat(state.question)
        return { 
            conversation: temp.concat( reactElArray),
            question: "" 
        }
    })
  }

  newlineText = (res) => {
    const newText = res.split('\n').map(str => <p className='conversation-label'>{str}</p>);
    return newText;
  }
  
  render(){
      return(
        <div className='room-main'>
          {/* <div id="scene-container" ></div> */}
         <div className = 'main' id="scene-container">
          <Conversation path='/c' HumanModel={this.props.HumanModel}/>
         </div>
         <div id="sidebar"> 
          <div id='item1'>
            <p className='conversation-label'>{this.intro()} </p>
            {this.state.conversation}
            {this.state.question}
            <p></p>
          </div>
           <GPT3_Integrated FirstName={this.props.FirstName} HumanModel={this.props.HumanModel} visibility={this.state.isTextBoxVisible} onPrompt={this.onPrompt} onResponse={this.onResponse}/> 
         </div>
        
        </div>
      )
    }
  }

  
  
  
  
  
  
  

  

