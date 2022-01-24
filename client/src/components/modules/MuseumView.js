import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import "./MuseumView.scss";
import { useModal } from "react-hooks-use-modal";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from "@react-three/drei";
import { proxy, snapshot, useSnapshot } from "valtio";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  addFrame,
  dequeueFrame,
  addInitialFrames,
  changeTransformMode,
  addCurrentMuseum,
} from "../action";

import { useControls } from "leva";
import FrameCard from "./FrameDetails";

const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
    frameToTransform: state.frameToTransform,
    mode: state.mode,
    currentMuseum: state.currentMuseum,
  };
};

import Model from "./Ploid";
import Frame from "./Frame";
import Controls from "./Controls";
import ModalViewer from "./ModalViewer";
import { addFrameToQueue } from "../action";
import APIInterface from "../../api/api";
import MuseumAPI from "../../api/museum";

const GOLDENRATIO = 1.61803398875;

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  frameToEdit: null,
  mode: "disabled",
  frameExists: false,
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function Frames({ frames, frameToTransform, mode, dispatch }) {
  const ref = useRef();

  // console.log("these are the frames", frames);
  useEffect(() => {}, [frameToTransform, mode]);
  useFrame((state, dt) => {});

  const snap = useSnapshot(state);
  return (
    <group ref={ref} onClick={(e) => e.stopPropagation()}>
      {frames.map(
        (props,index) => <Frame mode={mode} dispatch={dispatch} frameToTransform={frameToTransform} snap={snap} key={index + '-frame' }  url={props.imageUrl} color={props.frameColor} name={props.name} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}

/**
 * Idea from here https://github.com/pmndrs/react-three-fiber/discussions/487
 */
const Plane = ({ planeLength, planeWidth, planeColor, planeStrength, textureIndex }) => {
  const texture0 = useLoader(THREE.TextureLoader, "/assets/images/wood.png");
  const texture1 = useLoader(THREE.TextureLoader, "/assets/images/water.jpg");
  const texture2 = useLoader(THREE.TextureLoader, "/assets/images/grass.jpg");

  let textures = [texture0, texture1, texture2];
  return (
    <group>
      <mesh>
        <planeGeometry args={[planeLength, planeWidth]} />
        <meshBasicMaterial
          attach="material"
          map={textures[textureIndex]}
          blur={[100, 100]}
          resolution={2048}
          mixStrength={planeStrength}
          color={planeColor}
        />
      </mesh>
    </group>
  );
};

const FrameWorld = ({ id, queuedFrame, isThereQueuedFrame }) => {
  const dispatch = useDispatch();

  const getAllFrames = async () => {
    let f = await APIInterface.getAllFrames(id);
    dispatch(addInitialFrames(f.data));
  };

  const getCurrentMuseum = async () => {
    let f = await MuseumAPI.getCurrentMuseum(id);
    dispatch(addCurrentMuseum(f.data));
  };

  const control = useRef();
  const camera = useRef();
  const ref = useRef();
  const mode = useSelector((state) => state.mode);
  const frameToTransform = useSelector((state) => state.frameToTransform);
  const currentMuseum = useSelector((state) => state.currentMuseum);
  const currentFrame = useSelector((state) => state.currentFrame);
  const frames = useSelector((state) => state.frames);
  // let currentFramesList = frames.filter((frame)=>frame._id===frameToTransform);
  // let currentFrameData = frame.filter

  // console.log("this is the current frame", currentFrame);
  let [currentFrameData, setFrameData] = useState({
    name: "Click on a Frame",
    text: "You will see frame details when you click on a frame",
  });

  const [textureIndex, setTextureIndex] = useState(currentMuseum ? currentMuseum.textureIndex : 0);
  const [planeLength, setPlaneLength] = useState(currentMuseum ? currentMuseum.planeLength : 20);
  const [planeWidth, setPlaneWidth] = useState(currentMuseum ? currentMuseum.planeWidth : 20);
  const [planeStrength, setPlaneStrength] = useState(currentMuseum ? currentMuseum.planeStrength : 2);
  const [planeColor, setPlaneColor] = useState(currentMuseum ? currentMuseum.planeColor : "#ffffff");
  const [intensity, setIntensity] = useState(currentMuseum ? currentMuseum.intensity : 1);
  const [backgroundColor, setBackgroundColor] = useState(
    currentMuseum ? currentMuseum.backgroundColor : "#ffffff"
  );
  const [fogColor, zello] = useState(currentMuseum ? currentMuseum.fogColor : "#ffffff");

  useEffect(() => {
    if (frameToTransform) {
      let currentFramesList = frames.filter((frame) => frame._id === frameToTransform);
      if (currentFramesList.length > 0) {
        setFrameData({ name: currentFramesList[0].name, text: currentFramesList[0].text });
      }
    }
    if (currentMuseum){
      setBackgroundColor(currentMuseum?.backgroundColor)
      setTextureIndex(currentMuseum?.textureIndex)
      setPlaneWidth(currentMuseum?.planeWidth)
      setPlaneLength(currentMuseum?.planeLength)
      setPlaneStrength(currentMuseum?.planeStrength)
      setPlaneColor(currentMuseum?.planeColor)
      setIntensity(currentMuseum?.intensity)
    }
  }, [currentMuseum, frameToTransform]);

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      getAllFrames();
      getCurrentMuseum();
    }
    return () => (mounted = true);
  }, [frameToTransform]);



  // console.log("Let's see what this bad boy has",currentMuseum)
  console.log("I find this backgroundColor",backgroundColor, currentMuseum,currentMuseum?.backgroundColor)


  // useEffect
  return (
    <>
      <FrameCard
        dispatch={dispatch}
        currentFrame={currentFrame}
        name={currentFrame?.current?.userData?.name}
        text={currentFrame?.current?.userData?.text}
        parentId={id}
        frameToTransform={frameToTransform}
      />
      <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={ref}>
        <ambientLight intensity={intensity} />
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <group position={[0, -0.5, 0]}>
            <Model
              // clothes={snap.items.clothes}
              // body={snap.items.body}
              // chest={snap.items.chest}
              // eyes={snap.items.eyes}
              scale={0.21}
              // position={[0, 0, 0]}
              controls={control}
              camera={camera}
            />
            {
              <Frames
                dispatch={dispatch}
                camera={camera}
                frameToTransform={frameToTransform}
                mode={mode}
                frames={frames}
              />
            }
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <Plane
                planeLength={planeLength}
                planeWidth={planeWidth}
                planeColor={planeColor}
                planeStrength={planeStrength}
                textureIndex={textureIndex}
              />
            </mesh>
          </group>
          <OrbitControls
            makeDefault
            ref={control}
            // autoRotate
            // autoRotateSpeed={0.3}
            // maxPolarAngle={Math.PI / 2 - 0.05}
            // minPolarAngle={Math.PI / 2.3}
            enableZoom={true}
            enablePan={true}
            minDistance={0}
            maxDistance={10}
            enableDamping={true}
            ref={control}
          />
          <PerspectiveCamera
            makeDefault
            ref={camera}
            fov={40}
            position={[0, 0, 5]}
            aspect={window.innerWidth / window.innerHeight}
          ></PerspectiveCamera>
        </Suspense>
      </Canvas>
    </>
  );
};

export default connect(mapStateToProps)(FrameWorld);
