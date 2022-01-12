import React, { Component } from "react";
import {
    Camera,
    Material,
    Group, 
    Scene,
    Texture,
    } from 'three';


import {
    BoxGeometry,
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
      const width = this.mount.clientWidth
      const height = this.mount.clientHeight
      //ADD SCENE
      this.scene = new Scene()
      //ADD CAMERA
      this.camera = new PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      )
      this.camera.position.z = 4
      //ADD RENDERER
      this.renderer = new WebGLRenderer({ antialias: true })
      this.renderer.setClearColor('#000000')
      this.renderer.setSize(width, height)
      this.mount.appendChild(this.renderer.domElement)
      //ADD CUBE
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: '#433F81'     })
      this.cube = new Mesh(geometry, material)
      this.scene.add(this.cube)
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
        <div
          style={{ width: '400px', height: '400px' }}
          ref={(mount) => { this.mount = mount }}
        />
      )
    }
  }

  
  
  
  
  
  
  

  

