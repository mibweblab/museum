import React, { Suspense, useLayoutEffect, useState, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
// import { HexColorPicker } from "react-colorful";
// import { proxy, useSnapshot } from "valtio";
// import Controls from "./Controls";
// import { connect } from "react-redux";
// import Model from "./Ploid";
// import GrassCube from "./nature/CubeGrass";
// import Tree from "./nature/Tree";
import {
  TextureLoader,
  RepeatWrapping,
  DoubleSide,
} from 'three';
import Door from './Door.js'
import { getCameraPosition, getFloorDir } from './../../HumanModel.js'

import "./Conversation.scss";
import {
  meshBasicMaterial,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stage,
  PresentationControls,
  planeGeometry
} from "@react-three/drei";


function Floor({HumanModel}) {
  console.log(HumanModel)
  const floorDir = getFloorDir(HumanModel)
  console.log(floorDir)
  const floorTexture = useLoader(TextureLoader, floorDir)
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  return (
  <mesh position={[0, -4, 0]} receiveShadow={true} rotation={[-0.5 * Math.PI, 0, 0]}>
    <planeGeometry args={[150, 150, 5, 5]} />
    <meshBasicMaterial attach='material' map={floorTexture} side={DoubleSide}/>
  </mesh>)
}

function Figure({HumanModel}) {
  switch (HumanModel) {
    case Shakespeare:
    case Einstein:
    case UserUpload: 
    case Musk:
      break
  }
}

// function Door(userUpload) {

//   const loader = new GLTFLoader();

//   const [doorData] = await Promise.all([
//     loader.loadAsync('/wooden_door/scene.gltf'),
//   ]);

//   const floorTexture = useLoader(TextureLoader, floorDir)
//   const door = setupModel(doorData, undefined, "door");
//   door.scale.set(6, 6, 6)
  

//   if (userUpload) {
//     door.rotation.y = Math.PI / 2
//     door.position.set(-30, 12, 75)
//   } else {
//     door.rotation.y = -Math.PI / 2
//     door.position.set(30, 12, -75)
//   }


//   return door;
// }
const Conversation = ({
  HumanModel

  }) => {
    const control = useRef();
    const camera = useRef();
    const [buildState, setBuildState] = useState("add");
    console.log(HumanModel)
    const cameraCoordinates = getCameraPosition(HumanModel)
    //   const snap = useSnapshot(state);
    return (
      <div className="Conversation">


        <Canvas dpr={[1, 2]} shadows>
          <ambientLight intensity={0.5} />
          <color attach="background" args={["#f1f1f1"]} />
          <fog attach="fog" args={["#f1f1f1", 160, 300]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <OrbitControls
              makeDefault
              // autoRotate
              // autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 2}
              // minPolarAngle={Math.PI / 2.3}
              enableZoom={true}
              enablePan={false}
              minDistance={10}
              maxDistance={100} //PROBLEM
              enableDamping={true}
              ref={control}
              listenToKeyEvents={window}
            />
  
            <PerspectiveCamera
              ref={camera}
              fov={50}
              position={[cameraCoordinates.x, cameraCoordinates.y, cameraCoordinates.z]}
              aspect={window.innerWidth / window.innerHeight}
              near={0.1}
              far={1000}
            >
              {/* <spotLight
                  position={[-4, 10, -10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={100}
                  castShadow
                  shadow-mapSize={[2048, 2048]}
                /> */}
            </PerspectiveCamera>
            <Floor HumanModel={HumanModel}/>
            <Door position={[30, 12, 75]} rotation={[0, Math.PI / 2, 0]} scale={[6, 6, 6]}/>
          </Suspense>
        </Canvas>
      </div>
    );
  };

export default (Conversation);