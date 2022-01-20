import React, { Suspense,  useState, useRef } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";

import {
  TextureLoader,
  RepeatWrapping,
  DoubleSide,
  Color,

} from 'three';

import Door from './Door.js'
import Figure from './Figure.js'
import { getCameraPosition, getFloorDir } from './../../HumanModel.js'
import { createCamera } from './../modules/RoomScenes/components/camera'
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

function FrameSide({color, position, size}) {
  console.log('build me too')
  console.log(position)
  console.log(size)
  console.log(color)
  const frameTexture = useLoader(TextureLoader, '/frame.png')
  return (
    <mesh position={position}>
      <boxGeometry args={size}/>
      <meshBasicMaterial color={color} map={frameTexture}/>
    </mesh> 
  )
}

function Frame({color}) {
  console.log('build me')
  return (
    <group>
      <FrameSide color={color} position={[9, 20, 0]} size={[2, 28, 1 ]}/>
      <FrameSide color={color} position={[-9, 20, 0]} size={[2, 28, 1 ]}/>
      <FrameSide color={color} position={[0, 33, 0]} size={[16, 2, 1]}/>
      <FrameSide color={color} position={[0, 7, 0]} size={[16, 2, 1 ]}/>
    </group>

  )
}

// const Light = () => {
//   const ref = useRef()
//   useHelper(ref, DirectionalLightHelper, 1)

//   return (
//     <>
//       {/* <ambientLight intensity={0.5} /> */}

//     </>
//   )
// }

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
      maxDistance={100}
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
  ...props
  }) => {
    const ref = useRef();
    const camera = useRef();
    const canv = useRef()
    const [buildState, setBuildState] = useState("add");

    const frameColor = new Color('grey')
    const camera2 = createCamera(window.innerWidth, window.innerHeight, HumanModel)
    camera2.ref = camera
    const big = [20, 0.3]
    const med = [10, 0.6]
    const small = [5, 1.0]
    return (
      <div className="Conversation">
        <color attach="background" args={["#f1f1f1"]} />
        <fog attach="fog" args={["#f1f1f1", 160, 300]} /> 
        <Canvas ref={canv} dpr={[1, 2]} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight
              ref={ref}
              intensity={1.5}
              position={[10, 10, 10]}
            />   
          <Suspense fallback={<Loading size={big} />}>
            <CameraControls HumanModel={HumanModel}/>
            {/* <Environment preset="city" /> */}
          </Suspense>
          <Suspense fallback={<Loading size={med}/>}>
            <Floor HumanModel={HumanModel}/>
          </Suspense>
          <Suspense fallback={<Loading size={small}/>}>
            <Figure HumanModel={HumanModel}/>
            <Door position={[30, 12, -75]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 6, 6]} navigate={props.navigate}/>
            <Frame color={frameColor}/>  
          </Suspense>
        </Canvas>
      </div>
    );
  };

export default (Conversation);