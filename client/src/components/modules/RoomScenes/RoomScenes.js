import React, { Component } from "react";
import { Shakespeare, Einstein, Musk, UserUpload } from "../../../HumanModel"
import { createControls } from './systems/controls.js';
import { createCamera } from "./components/camera.js"
import { createShakespeare } from "./components/objects/shakespeare2"
import { createMusk } from "./components/objects/musk"
import { createEinstein } from "./components/objects/einstein2"
import { createUserUpload } from "./components/objects/userUpload"

import { createScene } from "./components/scene" ;  
import {createRenderer} from "./systems/renderer" ;  
import { createLights } from './components/lights.js';
import { Loop } from './systems/loop.js';
import { Resizer } from './systems/resizer.js';

import { Vector2, Raycaster } from 'three';


import "./RoomScenes.css"


class World extends Component{
    constructor(props) {
      super(props);
      this.raycaster = new Raycaster()
      this.camera = createCamera(props.mount.clientWidth, props.mount.clientHeight, props.HumanModel)
      this.renderer = createRenderer(props.mount.clientWidth, props.mount.clientHeight)
      this.scene = createScene()
      this.loop = new Loop(this.camera, this.scene, this.renderer);
      props.mount.appendChild(this.renderer.domElement)
      
      this.controls = createControls(this.camera, this.renderer.domElement);
 
      const { group3 } = createLights(this.props.HumanModel);
      // this.spotLight = spotLight
      this.loop.updatables.push(this.controls);
      this.scene.add(group3);

      
      const resizer = new Resizer(props.mount, this.camera, this.renderer);

      this.mouse = new Vector2();
      document.addEventListener( 'click', e => this.onClick(e), false );

      this.textCoordinates = {x:15, y:8.5, z:10}
      this.fontString = "/fonts/gent.json"
    }


  init = async() => {
    switch (this.props.HumanModel) {
      case Shakespeare:
        const {group0} = await createShakespeare()
        // this.loop.updatables.push(book);
        this.scene.add(group0);
        // this.spotLight.target = shakespeare
        this.scene.add(this.spotLight)
        // this.gptText = await createText('', this.textCoordinates, false, this.fontString)
        this.scene.add(this.gptText);
        break
      case Einstein:
        const {group1} = await createEinstein()
        // this.loop.updatables.push(group1);
        this.scene.add(group1);
        break
      case UserUpload:
        const {userUploadGroup, UUMovableGroup } = await createUserUpload()
        this.scene.add(userUploadGroup);
        this.loop.updatables.push(UUMovableGroup);
        break
      case Musk:
        const { muskGroup } = await createMusk()
        this.scene.add(muskGroup);
        break
    }    
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
    switch (this.props.HumanModel) {
      case Shakespeare:
        this.scene.remove(this.gptText)
        // this.gptText = await createText(text, this.textCoordinates, false, this.fontString)
        this.scene.add(this.gptText);
        break
      case Einstein:
        break
      case Musk:
        break
      case UserUpload:
        break
    }
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
      const doorClicked = (object.parent.name === 'door') 
      if (doorClicked) {
        this.props.navigate('/')
      }

      
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

  
  
  
  
  
  
  

  

