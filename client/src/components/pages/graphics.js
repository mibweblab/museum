import React, { Component } from "react";
import { World} from "../../World/World.js" ;  


import "../../World/World.css";



export default class Graphics extends Component{
  constructor(props) {
    super(props); 
    
    
  } 
  componentDidMount(){
    this.help()
  }

  componentDidUpdate(){
    this.help()
  }
  help = async() => {
    // Get a reference to the container element
    this.world = new World({mount:this.mount})
    console.log(this.world)
    await this.world.init()
    this.world.start()
  }

  
  
  render(){
      return(
        <div id="scene-container" ref={(mount) => { this.mount = mount }}>          
        </div>
      )
    }
  }

  
  
  
  
  
  
  

  

