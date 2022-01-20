import React, { Component } from "react";
import { World} from "../modules/RoomScenes/RoomScenes.js" ;  
import GPT3_Integrated from "./GPT3_Integrated.js";
import { Shakespeare, Einstein, Musk } from "../../HumanModel.js";
import { getIntro} from '../../LangModel.js'
import "../modules/RoomScenes/RoomScenes.css";

import Conversation from "./Conversation.js";
export default class Rooms extends Component{
  constructor(props) {
    super(props); 
    this.state = {
      isTextBoxVisible: "visible",
      conversation: []
    };
  } 

  intro() {
    return getIntro(this.props.HumanModel)
  }
  componentDidMount(){
    this.initWorld()
  }

  componentDidUpdate(){
    this.initWorld()
  }

  initWorld = async() => {
    this.world = new World({mount:this.mount, visibilityToggle: this.visibilityToggle, HumanModel:this.props.HumanModel, trial:this.props.trial, navigate:this.props.navigate})
    await this.world.init()
    this.world.start()
  }

  visibilityToggle = async(figureClicked) => {
    if (figureClicked && (this.state.isTextBoxVisible == 'hidden')) {
    //  || (!figureClicked && (this.state.isTextBoxVisible == 'visible'))) {
      let textBoxVisibility = (figureClicked) ? 'visible' : 'hidden'
      this.setState({ isTextBoxVisible: textBoxVisibility }, () => console.log(this.state.isTextBoxVisible));
    }
  }


  onResponse = async(responseText) => {
    const reactElArray = this.newlineText(responseText)
    this.setState({ conversation: this.state.conversation.concat(reactElArray)})

  }

  newlineText = (res) => {
    const newText = res.split('\n').map(str => <p className='conversation-label'>{str}</p>);
    
    return newText.concat(<br></br>);
  }
  
  render(){
      return(
        <div className='room-main'>
          {/* <div id="scene-container" ></div> */}
         <div className = 'main' id="scene-container">
          <Conversation path='/c' HumanModel={Shakespeare}/>
         </div>
         <div id="sidebar"> 
          <div id='item1'>
            <p className='conversation-label'>{this.intro()} </p>
            {this.state.conversation}
            <p></p>
          </div>
           <GPT3_Integrated FirstName={this.props.FirstName} HumanModel={this.props.HumanModel} visibility={this.state.isTextBoxVisible} onResponse={this.onResponse}/> 
         </div>
        
        </div>
      )
    }
  }

  
  
  
  
  
  
  

  

