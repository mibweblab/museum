import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF, Loader } from '@react-three/drei'

import { Footer } from '@pmndrs/branding'
import './wander.css'
import {
  TextureLoader,
  RepeatWrapping,
  MirroredRepeatWrapping,
  
} from 'three';


const primaryDim = '#a1a2ad'; // from utilities.css
function Carla(props) {
  const { scene } = useGLTF('/carla-draco.glb')
  return <primitive object={scene} {...props} />
}

function VideoText({ clicked, ...props }) {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/wonderClip14.mp4', crossOrigin: 'Anonymous', loop: true, muted: "muted", autoplay: "autoplay"}))
  useEffect(() => {
    if (clicked) { video.play() }
  })
  
  const gradientTexture = useLoader(TextureLoader, './background.jpg')
  return (
    <>
    <mesh receiveShadow={true} {...props} position={[0, -1.0, -3]}>
    <planeGeometry args={[50, 3, 1, 1]} color={'white'} />
    {clicked && <meshBasicMaterial toneMapped={false} opacity={0.5}>
        <videoTexture attach="map" wrapT={RepeatWrapping} wrapS={MirroredRepeatWrapping}   premultiplyAlpha={true} opacity={0.4} transparent={true} repeat={[1, 1]}  args={[video]} color={'white'} encoding={THREE.sRGBEncoding} muted="muted" loop autoplay allow={"autoplay"}/>
     </meshBasicMaterial>}
 
  </mesh>
  <mesh receiveShadow={true} {...props} position={[0, -1, -3]}>
    <planeGeometry args={[50, 3, 1, 1]}  />
    {clicked && <meshBasicMaterial toneMapped={false} color={'white'} opacity={0.5} transparent={true}>
     </meshBasicMaterial>}
 
  </mesh>
    <Text className="wander-font" color={('black')}  font="/Inter-Bold.woff" fontSize={3} letterSpacing={0.0} {...props} >
     WANDER
     <meshBasicMaterial map={gradientTexture} color={'black'}>
    </meshBasicMaterial>
    </Text>
    </>
  )
}


function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Text
    font="/Inter-Bold.woff"
    fontSize={3}
    color={"#FF5200"}
    rotation={[-(Math.PI * 3) / 8, Math.PI, Math.PI]}
    letterSpacing={0.0}
    position={[0, -1, 0]}>
    WONDER
  </Text>
 
  )
}


export default function Wander() {
  const [clicked, setClicked] = useState(false)
  const [ready, setReady] = useState(false)
  const store = { clicked, setClicked, ready, setReady }
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    document.addEventListener("mousemove", () => {
      const scrollCheck = window.scrollY < 100
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck)
        setClicked(true)
      }
    })
  })

  return (
    <>
      <Canvas className='Wander-Canvas' concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 25], fov: 25 }} >
        <color attach="background" args={["white"]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <VideoText {...store} position={[0, 1.3, -2]} />
            <Ground />
          </group>
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <directionalLight position={[-20, 0, -10]} intensity={0.7} />
          <Intro start={ready && clicked} set={setReady} setClicked={setClicked} />
        </Suspense>
      </Canvas>
      <Loader initialState={(active) => true}/>
    </>
  )
}

function Intro({ start, set, setClicked }) {
  const [vec] = useState(() => new THREE.Vector3())
  useEffect(() => setTimeout(() => { set(true); }, 500), [ ])
  return useFrame((state) => {
    if (start) {
      state.camera.position.lerp(vec.set(0, 3, 14), 0.05)
      state.camera.lookAt(0, 0, 0)
    }
  })
}
