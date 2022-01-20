import React from "react";
import { useLoader } from "@react-three/fiber";

import {
  TextureLoader,
  RepeatWrapping,
  DoubleSide,
} from 'three';

import {  getFloorDir } from '../../../HumanModel.js'


function FrameSide({color, position, size}) {
    const frameTexture = useLoader(TextureLoader, '/frame.png')
    return (
      <mesh position={position}>
        <boxGeometry args={size}/>
        <meshBasicMaterial color={color} map={frameTexture}/>
      </mesh> 
    )
}
  
function Frame({color}) {
  return (
    <group>
      <FrameSide color={color} position={[9, 20, 0]} size={[2, 28, 1 ]}/>
      <FrameSide color={color} position={[-9, 20, 0]} size={[2, 28, 1 ]}/>
      <FrameSide color={color} position={[0, 33, 0]} size={[16, 2, 1]}/>
      <FrameSide color={color} position={[0, 7, 0]} size={[16, 2, 1 ]}/>
    </group>

  )
}


function Floor({HumanModel}) {
  const floorDir = getFloorDir(HumanModel)
  const floorTexture = useLoader(TextureLoader, floorDir)
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  return (
  <mesh position={[0, -4, 0]} receiveShadow={true} rotation={[-0.5 * Math.PI, 0, 0]}>
    <planeGeometry args={[150, 150, 5, 5]} />
    <meshBasicMaterial attach='material' map={floorTexture} side={DoubleSide}/>
  </mesh>)
}


export {Frame, FrameSide, Floor}