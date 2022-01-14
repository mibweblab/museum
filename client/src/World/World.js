import React, { Component } from "react";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { createControls } from './systems/controls.js';
import { createCamera } from "./Comps/camera.js"
import { loadBirds } from "./Comps/objects/birds/birds.js"
import { createCube } from "./Comps/objects/cube.js"
import { createShakespeare } from "./Comps/objects/shakespeare"
import { createMeshGroup } from './Comps/meshGroup.js';
import { createScene } from "./Comps/scene" ;  
import {createRenderer} from "./systems/renderer" ;  
import { createLights } from './Comps/lights.js';
import { Loop } from './systems/loop.js';
import { Resizer } from './systems/resizer.js';

import "./World.css"




class World extends Component{
    constructor(props) {
      super(props);

      this.camera = createCamera(props.mount.clientWidth, props.mount.clientHeight)
      this.renderer = createRenderer(props.mount.clientWidth, props.mount.clientHeight)
      this.scene = createScene()
      this.loop = new Loop(this.camera, this.scene, this.renderer);
      props.mount.appendChild(this.renderer.domElement)

      this.controls = createControls(this.camera, this.renderer.domElement);

      
      // , , 
      const { mainLight, ambientLight, ambientLight2 } = createLights();

      this.loop.updatables.push(this.controls);
      this.scene.add(mainLight, ambientLight, ambientLight2);
      
     
      
      const resizer = new Resizer(props.mount, this.camera, this.renderer);


    }

  init = async() => {
    // const { parrot, flamingo, stork } = await loadBirds();
    const {shakespeare, floor, sphere} = await createShakespeare()
    // move the target to the center of the front bird
    this.controls.target.copy(shakespeare.position);

    this.scene.add(shakespeare, floor, sphere);
    
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

  
  
  
  
  
  
  

  

