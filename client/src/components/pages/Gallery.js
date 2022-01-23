import * as THREE from 'three'

import React, { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, Loader } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875



export default function Gallery({ images }) {
   console.log(images)
  return (
    <>
    <Canvas gl={{ alpha: false }} dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <Suspense fallback={null}>
      <color attach="background" args={['#fffff']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <Environment preset="city" />
      
        
      <group position={[0, -0.5, 0]}>
        <Frames images={images} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={450}
            mixBlur={1}
            mixStrength={2}
            roughness={10}
            depthScale={1.2}
            minDepthThreshold={0.0}
            maxDepthThreshold={5}
            color="#ffffff"
            metalness={0.5}
          />
        </mesh>
      </group>
      </Suspense>
    </Canvas>

    </>
    
  )
}


function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()

  const [frameSelectionState, setFrameSelectionState] = useState("/");

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(frameSelectionState)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt))
    state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt))
  })
  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setFrameSelectionState(clicked.current === e.object ? '/' : e.object.name))}
      onPointerMissed={() => setFrameSelectionState('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const image = useRef()
  const frame = useRef()
  console.log(url)
  const name = getUuid(url)
  useCursor(hovered)
  useFrame((state) => {
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85 * (hovered ? 0.85 : 1), 0.1)
    image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9 * (hovered ? 0.905 : 1), 0.1)
    frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
  })
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} scale={[0.2, 0.2, 0.1]} />
      </mesh>

    </group>
  )
}

