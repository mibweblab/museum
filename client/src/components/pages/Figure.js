import React, { Suspense, useRef } from 'react'
import { useGLTF,  } from '@react-three/drei'
import { Shakespeare, Einstein, Musk, UserUpload } from '../../HumanModel'
export default function Figure({HumanModel}) {
    let figureDir = ''
    let scale = [1, 1, 1]
    let position = [0, 0, 0]
    let rotation = [0, 0, 0]
    switch (HumanModel) {
        case Shakespeare:
            figureDir = '/shakespeare/scene.gltf'
            scale = [3, 3, 3]
            position = [-11.5, 20, -5]
            rotation = [0, Math.PI / 3, 0]
        case Einstein:
            // link = 
        case UserUpload: 
        case Musk:
          break
      }
const gltf = useGLTF(figureDir)
return (
   
    <primitive object={gltf.scene} scale={scale} position={position} rotation={rotation}/>

)
}

useGLTF.preload('/shakespeare/scene.gltf')  