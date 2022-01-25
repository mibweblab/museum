import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from '../../pages/ScrollControls.js'

function Image(props) {
  const ref = useRef()
  const group = useRef()
  const data = useScroll()
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })
  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  )
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport)
  const w = width < 10 ? 1.5 / 3 : 1 / 3
  const factor = 2
  return (
    <group {...props}>
      <Image style={{borderRadius:"10px", border:"double 10px grey" }} position={[-width * w, 0, -1]} scale={[(width * w - m * 2) / factor, (5) / factor, 1 / factor]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[(width * w - m * 2) / factor, 5/ factor, 1 / factor]} url={urls[1]} />
      <Image position={[width * w, 0, 1]} scale={[(width * w - m * 2) / factor, 5 / factor, 1 / factor]} url={urls[2]} />
      <Image position={[-width * (w / 2), 0, -1]} scale={[(width * w - m * 2) / factor, (5) / factor, 1 / factor]} url={urls[3]} />
      <Image position={[-(width * w), 0, 0]} scale={[(width * w - m * 2) / factor, 5/ factor, 1 / factor]} url={urls[4]} />
      <Image position={[(width * w) / 2, 0, 1]} scale={[(width * w - m * 2) / factor, 5 / factor, 1 / factor]} url={urls[5]} />
      <Image position={[(width * w), 0, 0]} scale={[(width * w - m * 2) / factor, 5/ factor, 1 / factor]} url={urls[6]} />
      <Image position={[(width * w) / 2, 0, -1/2]} scale={[(width * w - m * 2) / factor, 5 / factor, 1 / factor]} url={urls[7]} />
    </group>
  )
}

function Pages() {
  const { width } = useThree((state) => state.viewport)
  const urls = ['https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftrip1.jpg?alt=media&token=82045014-c771-4e04-b10e-fd4181e8348c', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftrip2.jpg?alt=media&token=aa4300cd-22d5-4d4c-8be3-bdbc6fbaa280', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftrip3.jpg?alt=media&token=8c49f3be-5ae4-402f-b24e-92e7302dee4b', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg1.jpg?alt=media&token=8c802597-5ac7-4b92-ad4b-244bdd7cc6b1', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg2.jpg?alt=media&token=08016bac-bb29-4b6c-a13d-2a6cfb1d442d', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg3.jpg?alt=media&token=cc0b429c-8cce-4afc-9114-dad35e1655a3', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg4.jpg?alt=media&token=60511368-1bc9-45e7-bc20-34a10448bd7c', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg5.jpg?alt=media&token=7817721a-108f-4f64-a542-192b9181249c', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fimg6.jpg?alt=media&token=f988e190-6575-4ed0-84c7-06f439d32bf0', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fim1.jpg?alt=media&token=54ab775c-6eec-43ca-92c3-add5a1e38223', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fim2.jpg?alt=media&token=fdac3187-daf4-49b9-94d2-714d1359d853', 
  ' https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fim3.jpg?alt=media&token=82ce33c7-a15e-4e60-8017-c0a23022e07a']
  return (
    <>
      <Page position={[-width * 1, 0, 0]} urls={[urls[0], urls[1], urls[2], urls[3], urls[4], urls[5], urls[9],  urls[11]]} />
      <Page position={[width * 0, 0, 0]} urls={[urls[6], urls[7], urls[8], urls[0], urls[2], urls[4], urls[10], urls[9]].reverse()} />
      <Page position={[width * 1, 0, 0]} urls={[urls[6], urls[8], urls[2], urls[3], urls[5], urls[7], urls[11], urls[10]]} />
      <Page position={[width * 2, 0, 0]} urls={[urls[0], urls[1], urls[2], urls[3], urls[4], urls[5],  urls[9], urls[11]].reverse()} />
      <Page position={[width * 3, 0, 0]} urls={[urls[6], urls[7], urls[8], urls[0], urls[2], urls[4], urls[10], urls[9]]} />
      <Page position={[width * 4, 0, 0]} urls={[urls[6], urls[8], urls[2], urls[3], urls[5], urls[7], urls[11], urls[10]].reverse()} />
    </>
  )
}

export default function GallerySecondary() {
  return (
    <Canvas className='GallerySecond' gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls infinite horizontal damping={4} pages={4} distance={1}>
          <Scroll>
            <Pages />
          </Scroll>
          <Scroll html>
            <h1 style={{ position: 'absolute', top: '20vh', left: '0vw', color:'grey' }}>Ask away.</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '40vw', color:'grey'}}>Ask away.</h1>
          </Scroll>
        </ScrollControls>
        <Preload />
      </Suspense>
    </Canvas>
  )
}
