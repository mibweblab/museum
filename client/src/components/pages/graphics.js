import React, { Component } from "react";
import { World} from "../../World/World.js" ;  
import GPT3_2 from "./GPT3_2.js";
import { Shakespeare, Einstein, Musk } from "../../LangModel.js";

import "../../World/World.css";



export default class Graphics extends Component{
  constructor(props) {
    super(props); 
    this.state = {
      conf: "visible",
    };
  } 

  componentDidMount(){
    this.help()
  }

  componentDidUpdate(){
    this.help()
  }
  help = async() => {
    // Get a reference to the container element
    this.world = new World({mount:this.mount, visibilityToggle: this.visibilityToggle})
    console.log(this.world)
    await this.world.init()
    this.world.start()
  }

  visibilityToggle = async(figureClicked) => {
    console.log('TOGGLED')
    console.log(this)
    console.log(this.state)
    if (figureClicked && (this.state.conf == 'hidden')) {
    //  || (!figureClicked && (this.state.conf == 'visible'))) {
      let huh = (figureClicked) ? 'visible' : 'hidden'
      this.setState({ conf: huh }, () => console.log(this.state.conf));
    }
    
    await this.world.gptHasSpoken('TESTING')

    
  }

  onRequest = async(figureClicked) => {
    await this.world.gptHasSpoken('Topic: ')
  }

  onResponse = async(responseText) => {
    console.log('graphics!')
    console.log(responseText)
    await this.world.gptHasSpoken(responseText)
  }
  
  render(){
      return(
        <>
         <div id="scene-container" ref={(mount) => { this.mount = mount }}></div>
         <GPT3_2 FirstName={this.props.FirstName} HumanModel={Shakespeare} visibility={this.state.conf} onResponse={this.onResponse}/> 

        </>

      )
    }
  }

  
  
  
  
  
  
  

  

