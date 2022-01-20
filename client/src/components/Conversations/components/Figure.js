import React, { Suspense, useRef } from 'react'
import { useGLTF,  } from '@react-three/drei'
import { Shakespeare, Einstein, Musk, UserUpload, getFigureSpecs } from '../../../HumanModel'
export default function Figure({HumanModel}) {
    const figureSpecs = getFigureSpecs(HumanModel)
    const gltf = useGLTF(figureSpecs.figureDir)
    return (
    <primitive object={gltf.scene} {...figureSpecs}/>
)
}

// useGLTF.preload('/conversation_assets/einstein2/scene.gltf')
// useGLTF.preload('/conversation_assets/elon_musk/scene.gltf')
// useGLTF.preload('/conversation_assets/shakespeare/scene.gltf')