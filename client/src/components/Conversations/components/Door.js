import React, { Suspense, useRef } from 'react'
import { useGLTF,  } from '@react-three/drei'

export default function Door(props) {
  const gltf = useGLTF('/conversation_assets/wooden_door/scene.gltf')
  return (
      <primitive  object={gltf.scene} {...props} onClick={() => props.navigate('/')}/>
  )
}
useGLTF.preload('/conversation_assets/wooden_door/scene.gltf')