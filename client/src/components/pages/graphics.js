import React, { Component } from "react";
import { World} from "../../World/World.js" ;  
import * as script from './script.js'

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
    script.helper()
    // Get a reference to the container element
    // this.world = new World({mount:this.mount})
    // console.log(this.world)
    // await this.world.init()
    // this.world.start()
  }

  
  
  render(){
      return(
        // <div id="scene-container" ref={(mount) => { this.mount = mount }}>          
        // </div>
        <>
          <div className="loading" id="js-loader">
            <div className="loader"></div>
          </div>
          <div className="wrapper">
              {/* <!-- The canvas element is used to draw the 3D scene --> */}
            <canvas id="c"></canvas>
          </div>
          <div className="frame">
            <h1 className="frame__title">Interactive 3D Character with Three.js</h1>
            <div className="frame__links">
              <a href="http://tympanus.net/Tutorials/Blurry/">Previous demo</a>
              <a href="https://tympanus.net/codrops/?p=43796">Tutorial</a>
            </div>
          </div>
          <span className="action">Click me!</span>
  
          {/* <!-- The main Three.js file --> */}
          <script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/108/three.min.js'></script>
          {/* <!-- This brings in the ability to load custom 3D objects in the .gltf file format. Blender allows the ability to export to this format out the box --> */}
          <script src='https://cdn.jsdelivr.net/gh/mrdoob/Three.js@r92/examples/js/loaders/GLTFLoader.js'></script>

          
          {/* <script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/108/three.min.js'></script> */}
          {/* <script src='https://cdn.jsdelivr.net/gh/mrdoob/Three.js@r92/examples/js/loaders/GLTFLoader.js'></script> */}
        </>

      )
    }
  }

  
  
  
  
  
  
  

  

