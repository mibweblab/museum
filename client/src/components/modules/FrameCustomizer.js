import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import getUuid from "uuid-by-string";
import "./FrameCustomizer.scss";
import {addFrame, addFrameToQueue, dequeueFrame} from '../action';

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import Frame from "./Frame";
import { connect } from "react-redux";


// const mapStateToProps = state => {
//   return {
//       frames: state.frames
//   }
// }

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;


  
const FrameCustomizer = ({ snap, dispatch, close }) => {
  const control = useRef();
  const camera = useRef();
  const ref = useRef();
  const url = pexel(1103970);
  const [name, setName] = useState(getUuid(url));


  return (
    <div className="FrameCustomizer">
      <div className="FrameCustomizer-canvas">
        <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={ref}>
          <color attach="background" args={["#191920"]} />
          <fog attach="fog" args={["#191920", 0, 15]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <group position={[0, -0.5, 0]}>
              <Frame name={name} url={url} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={60}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#151515"
                  metalness={0.5}
                />
              </mesh>
            </group>
            <OrbitControls makeDefault ref={control} />
            <PerspectiveCamera
              ref={camera}
              fov={70}
              position={[0, 2, 15]}
              aspect={window.innerWidth / window.innerHeight}
            ></PerspectiveCamera>
          </Suspense>
        </Canvas>
      </div>
      <div className="FrameCustomizer-side">
        <div className="FrameCustomizer-group">
          <input className="FrameCustomizer-input" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="FrameCustomizer-group">
          <button
            className="FrameCustomizer-add"
            onClick={() => {

                // dispatch(addFrame({name:name, url: pexel(1103970),  position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0]}))

                dispatch(addFrameToQueue({name:name, url: pexel(1103970)}))
                dispatch(dequeueFrame(true));
                close();

            //   console.log("here is the snap",snap,name)
            //   snap.current = { name };
            //   snap.frameExists = true;
            }}
          >
            Add Frame
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(FrameCustomizer);
