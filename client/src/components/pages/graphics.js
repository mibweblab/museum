import React, { Component } from "react";
import {
    Camera,
    Material,
    Group, 
    Scene,
    Texture,
    } from 'three';


import {
    BoxBufferGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    WebGLRenderer,
  } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';    
import "./graphics.css";



export default class Graphics extends Component{
    componentDidMount(){

      this.scene = new Scene()  
      this.scene.background = new Color('skyblue');

      const width = this.mount.clientWidth
      const height = this.mount.clientHeight
      const fov = 35;
      const aspect = width / height;
      const near = 0.1
      const far = 100

      
      this.camera = new PerspectiveCamera(
        fov,
        aspect,
        near,
        far
      )

      this.camera.position.set(0, 0, 10);
      const geometry = new BoxBufferGeometry(2, 2, 2)
      const material = new MeshBasicMaterial()
      this.cube = new Mesh(geometry, material)

      this.scene.add(this.cube)

      this.renderer = new WebGLRenderer()
      this.renderer.setSize(width, height)
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.mount.appendChild(this.renderer.domElement)
      //ADD CUBE
      
      
      
      
        this.start()
    }
  componentWillUnmount(){
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }
  stop = () => {
      cancelAnimationFrame(this.frameId)
    }
  animate = () => {
     this.cube.rotation.x += 0.01
     this.cube.rotation.y += 0.01
     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  render(){
      return(
        <div id="scene-container" ref={(mount) => { this.mount = mount }}>          
        </div>
      )
    }
  }

  
  
  
  
  
  
  

  

