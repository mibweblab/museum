import React, { Suspense,  useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";

import {

  Color,
} from 'three';
import Door from './components/Door.js'
import Figure from './components/Figure.js'
import { getCameraPosition, getFloorDir, UserUpload } from '../../HumanModel.js'

import "./Conversation.scss";
import {
  OrbitControls,
} from "@react-three/drei";
import { Frame, Floor } from './components/Objects.js'
import UserUploadObject from './components/UserUploadObject.js'


const CameraControls = ({HumanModel}) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  const coordinates = getCameraPosition(HumanModel)
  camera.position.set(coordinates.x, coordinates.y, coordinates.z);


  return (
    <OrbitControls
      ref={controls}
      args={[camera, domElement]}
      enableDamping={true}
      dampingFactor={0.5} 
      screenSpacePanning={false}
      minDistance={10}
      maxDistance={300}
      maxPolarAngle={Math.PI / 2}
      listenToKeyEvents={window}

    />
  );
};


function Loading({size}) {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[size[0], 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="grey"
        transparent
        opacity={size[1]}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}


const Conversation = ({
  HumanModel,
  FrameUrl,
  FrameId,
  ...props
  }) => {
    const ref = useRef();
    const camera = useRef();
    const canv = useRef()
    const [buildState, setBuildState] = useState("add");

    const frameColor = new Color('grey')
    const big = [20, 0.3]
    const med = [10, 0.6]
    const small = [5, 1.0]
    
    let isUserUpload = 1
    if (HumanModel == UserUpload) {
      isUserUpload = -1
    }
    return (
      <div className="Conversation">
        
        <Canvas ref={canv} dpr={[1, 2]} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight
              ref={ref}
              intensity={1.5}
              position={[10, 10, 10]}
            />   
          <Suspense fallback={<Loading size={big} />}>
            <color attach="background" args={["#f1f1f1"]} />
            <fog attach="fog" args={["#f1f1f1", 160, 300]} /> 
            <CameraControls HumanModel={HumanModel}/>
            {/* <Environment preset="city" /> */}
          </Suspense>
          <Suspense fallback={<Loading size={med}/>}>
            <Floor HumanModel={HumanModel}/>
          </Suspense>
          <Suspense fallback={<Loading size={small}/>}>
           
            {(HumanModel == UserUpload) ? 
              [ (FrameUrl != undefined) ? <UserUploadObject FrameUrl={FrameUrl}/> : null]
              :   
              (<Figure HumanModel={HumanModel}/>)}
            <Door position={[isUserUpload *30, 12, isUserUpload *-75]} rotation={[0, isUserUpload * -Math.PI / 2, 0]} scale={[6, 6, 6]} navigate={props.navigate}/>
            <Frame color={frameColor}/>  
          </Suspense>
        </Canvas>
      </div>
    );
  };

export default (Conversation);