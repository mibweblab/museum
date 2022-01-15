import React, { Component } from "react";
import { World} from "../modules/RoomScenes/RoomScenes.js" ;  
import GPT3_Integrated from "./GPT3_Integrated.js";
import { Shakespeare, Einstein, Musk } from "../../LangModel.js";

import "../modules/RoomScenes/RoomScenes.css";

export default class Rooms extends Component{
  constructor(props) {
    super(props); 
    this.state = {
      isTextBoxVisible: "visible",
    };
  } 

  componentDidMount(){
    this.initWorld()
  }

  componentDidUpdate(){
    this.initWorld()
  }

  initWorld = async() => {
    this.world = new World({mount:this.mount, visibilityToggle: this.visibilityToggle})
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
    await this.world.gptHasSpoken(responseText)
  }
  
  render(){
      return(
        <>
         <div id="scene-container" ref={(mount) => { this.mount = mount }}></div>
         <GPT3_Integrated FirstName={this.props.FirstName} HumanModel={Shakespeare} visibility={this.state.isTextBoxVisible} onResponse={this.onResponse}/> 
        </>
      )
    }
  }

  
  
  
  
  
  
  

  

