import React, { Component } from "react";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { createControls } from './systems/controls.js';
import { createCamera } from "./Comps/camera.js"
import { createShakespeare } from "./Comps/objects/shakespeare"
import { createText } from "./Comps/objects/textObject"
import { createScene } from "./Comps/scene" ;  
import {createRenderer} from "./systems/renderer" ;  
import { createLights } from './Comps/lights.js';
import { Loop } from './systems/loop.js';
import { Resizer } from './systems/resizer.js';


import { Vector2, Raycaster } from 'three';


import "./World.css"




class World extends Component{
    constructor(props) {
      super(props);
      
      this.raycaster = new Raycaster()
      this.camera = createCamera(props.mount.clientWidth, props.mount.clientHeight)
      this.renderer = createRenderer(props.mount.clientWidth, props.mount.clientHeight)
      this.scene = createScene()
      this.loop = new Loop(this.camera, this.scene, this.renderer);
      props.mount.appendChild(this.renderer.domElement)
      
      this.controls = createControls(this.camera, this.renderer.domElement);

      
 
      const { mainLight, ambientLight, ambientLight2 } = createLights();

      this.loop.updatables.push(this.controls);
      this.scene.add(mainLight, ambientLight, ambientLight2);
      
     
      
      const resizer = new Resizer(props.mount, this.camera, this.renderer);

      this.mouse = new Vector2();
      document.addEventListener( 'click', e => this.onClick(e), false );

      this.textCoordinates = {x:15, y:8.5, z:10}
    }

  init = async() => {
    const {shakespeare, book, floor, cylinder, text} = await createShakespeare()
    // move the target to the center of the front bird
    this.loop.updatables.push(book);
    this.scene.add(shakespeare, book, floor, cylinder, text);
    this.gptText = await createText('', this.textCoordinates)
    this.scene.add(this.gptText);
    
  }
  componentWillUnmount(){
      this.stop()
      this.props.mount.removeChild(this.renderer.domElement)
    }
  start = () => {
      this.loop.start()
    }
  stop = () => {
    this.loop.stop()

    }
  
    
  gptHasSpoken = async(text) => {
    
    this.scene.remove(this.gptText)
    this.gptText = await createText(text, this.textCoordinates)
    this.scene.add(this.gptText);
  }  
  onClick = (e) => {

    let mouse = {};
    mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    
      // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera);
  
      // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);
  
    if (intersects[0]) {
      let object = intersects[0].object;
      const shakeSpeareClicked = (object.parent.name === 'shakespeare') 
      this.props.visibilityToggle(shakeSpeareClicked);
    }
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  setSize = () => {
    let width = this.props.mount.clientWidth
    let height = this.props.mount.clientHeight
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };
  onResize() {
    this.render()
  }


  }

  export {World}

  
  
  
  
  
  
  

  

