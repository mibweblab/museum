import React from 'react'
import {
    TextureLoader,
  } from 'three';
import { FrameSide } from './Objects'
import { useLoader } from "@react-three/fiber";

export default function UserUploadObject() {
    const userUploadTexture = useLoader(TextureLoader, '/conversation_assets/anim.png')
    return (
        <>
            <mesh position={[0, 20, 0]} receiveShadow={true}>
                <boxGeometry args={[16, 24, 1]} />
                <meshBasicMaterial attach='material' map={userUploadTexture}/>
            </mesh>
        </>
    )
}
