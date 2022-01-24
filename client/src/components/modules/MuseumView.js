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

import { useControls} from "leva"; 
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

const ToggleTransforms = () => {
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  return (
    <div className="ToggleTransforms">
      <div className="d-flex justify-content-center mt-5 align-items-center">
        <section id="first" className="section">
          <div className="radio-container">
            <input
              type="radio"
              name="group1"
              id="radio-0"
              value=""
              onChange={(e) => {
                dispatch(changeTransformMode(e.target.value));
              }}
              checked={mode === ""}
            />
            <label for="radio-0">
              <span className="radio">Disable Transforms</span>
            </label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              name="group1"
              id="radio-1"
              value="translate"
              onChange={(e) => {
                dispatch(changeTransformMode(e.target.value));
              }}
              checked={mode === "translate"}
            />
            <label for="radio-1">
              <span className="radio">Translate</span>
            </label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              name="group1"
              id="radio-2"
              value="rotate"
              onChange={(e) => {
                dispatch(changeTransformMode(e.target.value));
              }}
              checked={mode === "rotate"}
            />
            <label for="radio-2">
              <span className="radio">Rotate</span>
            </label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              name="group1"
              id="radio-3"
              value="scale"
              onChange={(e) => {
                dispatch(changeTransformMode(e.target.value));
              }}
              checked={mode === "scale"}
            />
            <label for="radio-3">
              <span className="radio">Scale</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
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
 *
 * sets the texture type for the room floor
 * @param {*} setTextureType
 * @returns
 */
const TextureSelector = ({ setTextureType }) => {
  const images = [
    { key: "text01", text: "Wood", path: "/assets/images/wood.png" },
    {
      key: "text02",
      text: "Water",
      path: "/assets/images/water.jpg",
    },
    {
      key: "text03",
      text: "Grass",
      path: "/assets/images/grass.jpg",
    },
  ];

  let [hovered, setHovered] = useState(false);

  return (
    <div className="TextureSelector">
      {images.map(({ key, text, path }, index) => (
        <div className="TextureSelector-tileWrapper">
          <button key={key} className="TextureSelector-tile" onClick={() => setTextureType(index)}>
            <img src={path} className="TextureSelector-img" />
          </button>
          {hovered && <span className="TextureSelector-tileText">{text}</span>}
        </div>
      ))}
    </div>
  );
};

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
  const transformRef = useRef();
  const mode = useSelector((state) => state.mode);
  const frameToTransform = useSelector((state) => state.frameToTransform);
  const currentMuseum = useSelector((state) => state.currentMuseum);
  const currentFrame = useSelector((state) => state.currentFrame);
  const frames = useSelector((state) => state.frames);
  // let currentFramesList = frames.filter((frame)=>frame._id===frameToTransform);
  // let currentFrameData = frame.filter

  console.log("this is the current frame",currentFrame )
  let [currentFrameData, setFrameData] = useState({
      name: "Click on a Frame",
      text: "You will see frame details when you click on a frame"
  })
  



  useEffect(() => {
    if (frameToTransform){
      let currentFramesList = frames.filter((frame)=>frame._id===frameToTransform);
      if (currentFramesList.length>0){
        setFrameData({name:currentFramesList[0].name, text: currentFramesList[0].text})
      }
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


  const [textureIndex, _] = useState(currentMuseum ? currentMuseum.textureIndex : 0);
  const [planeLength, hello] = useState(currentMuseum ? currentMuseum.planeLength : 20);
  const [planeWidth,tello] = useState(currentMuseum ? currentMuseum.planeWidth : 20);
  const [planeStrength, mello] = useState(currentMuseum ? currentMuseum.planeStrength : 2);
  const [planeColor, fello] = useState(currentMuseum ? currentMuseum.planeColor : "#ffffff");
  const [intensity, wello ] = useState(currentMuseum ? currentMuseum.intensity : 1);
  const [backgroundColor, nello ] = useState(currentMuseum ? currentMuseum.backgroundColor : "#ffffff");
  const [fogColor, zello] = useState(currentMuseum ? currentMuseum.fogColor : "#ffffff");


  return (
    <>
      <FrameCard dispatch={dispatch} currentFrame={currentFrame} name={currentFrame?.current?.userData?.name} text={currentFrame?.current?.userData?.text}  parentId={id}frameToTransform={frameToTransform} />
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
              scale={0.2}
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
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
              onClick={async (e) => {
                e.stopPropagation();
                const [x, y, z] = Object.values(e.point).map((coord) => Math.ceil(coord));
                if (queuedFrame) {
                  queuedFrame.position = [x, y, z];
                  queuedFrame.rotation = [0, 0, 0];
                  queuedFrame.scale = [1, GOLDENRATIO, 0.05];
                  queuedFrame.imageZoomRatio = 1;
                  if (isThereQueuedFrame) {
                    dispatch(dequeueFrame(false));
                    dispatch(addFrameToQueue(null));
                    let {
                      type,
                      name,
                      url,
                      text,
                      color,
                      position,
                      rotation,
                      scale,
                      imageZoomRatio,
                    } = queuedFrame;
                    let frameRes = await APIInterface.addFrame(
                      type,
                      name,
                      url,
                      text,
                      color,
                      position,
                      rotation,
                      scale,
                      imageZoomRatio,
                      id
                    );
                    if (frameRes) {
                      dispatch(addFrame(frameRes.data));
                    }
                  }
                }
              }}
            >
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
            enableZoom={true}
            enablePan={false}
            minDistance={1}
            maxDistance={200}
            ref={control}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.75}
          />
          {mode !== "" && (
            <TransformControls
              ref={transformRef}
              mode={mode === "" ? "translate" : mode}
              object={currentFrame ? currentFrame.current : null}
              onChange={() => {
                if (mode === "translate") {
                  setFrame({
                    framePosX: transformRef.current.object.position.x,
                    framePosY: transformRef.current.object.position.y,
                    framePosZ: transformRef.current.object.position.z,
                  });
                } else if (mode === "rotate") {
                  setFrame({
                    frameRotateX: transformRef.current.object.rotation.x,
                    frameRotateY: transformRef.current.object.rotation.y,
                    frameRotateZ: transformRef.current.object.rotation.z,
                  });
                } else if (mode === "scale") {
                  setFrame({
                    frameXScale: transformRef.current.object.scale.x,
                    frameYScale: transformRef.current.object.scale.y,
                    // zScale: transformRef.current.object.scale.z,
                  });
                }
              }}
            />
          )}
          <PerspectiveCamera
            // makeDefault
            ref={camera}
            fov={100}
            position={[6, 6, 6]}
            aspect={window.innerWidth / window.innerHeight}
          ></PerspectiveCamera>
          {/* <axesHelper /> */}
        </Suspense>
      </Canvas>
    </>
  );
};

export default connect(mapStateToProps)(FrameWorld);
