/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('assets/nature/Bridge_Small.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bridge_Small.geometry}
        material={materials.Wood}
      />
    </group>
  )
}

useGLTF.preload('assets/nature/Bridge_Small.gltf')