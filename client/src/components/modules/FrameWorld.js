import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import "./FrameWorld.scss";
import { useModal } from "react-hooks-use-modal";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { proxy, snapshot, useSnapshot } from "valtio";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  addFrame,
  dequeueFrame,
  addInitialFrames,
  changeTransformMode,
  addCurrentMuseum,
} from "../action";
import { useControls, folder } from "leva";

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

  console.log("these are the frames", frames);
  useEffect(() => {}, [frameToTransform, mode]);
  useFrame((state, dt) => {});

  const snap = useSnapshot(state);
  return (
    <group ref={ref} onClick={(e) => e.stopPropagation()}>
      {frames.map(
        (props,index) => <Frame mode={mode} dispatch={dispatch} frameToTransform={frameToTransform} snap={snap} key={index + '-frame' } position={props.position} rotation={props.rotation} url={props.imageUrl} color={props.frameColor} name={props.name} {...props} /> /* prettier-ignore */
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

const FrameWorld = ({ id, frames, queuedFrame, isThereQueuedFrame }) => {
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

  const [
    { intensity, backgroundColor, fogColor, planeLength, planeWidth, planeColor, planeStrength },
    set,
  ] = useControls(() => ({
    intensity: {
      min: 0,
      max: 10,
      value: currentMuseum ? currentMuseum.intensity : 1,
      step: 1,
    },
    backgroundColor: currentMuseum ? currentMuseum.backgroundColor : "#ffffff",
    fogColor: currentMuseum ? currentMuseum.fogColor : "#ffffff",
    planeLength: {
      min: 1,
      max: 50,
      value: currentMuseum ? currentMuseum.planeLength : 20,
      step: 1,
    },
    planeWidth: {
      min: 1,
      max: 50,
      value: currentMuseum ? currentMuseum.planeWidth : 20,
      step: 2,
    },
    planeColor: currentMuseum ? currentMuseum.planeColor : "#ffffff",
    planeStrength: {
      min: 0,
      max: 100,
      value: currentMuseum ? currentMuseum.planeStrength : 1,
      step: 2,
    },
    planeMetal: {
      min: 1,
      max: 10,
      value: 1,
      step: 1,
    },
  }));

  useEffect(() => {
    set({ intensity: currentMuseum ? currentMuseum.intensity : 1 });
    set({ backgroundColor: currentMuseum ? currentMuseum.backgroundColor : "#ffffff" });
    set({ planeLength: currentMuseum ? currentMuseum.planeLength : 20 });
    set({ planeWidth: currentMuseum ? currentMuseum.planeWidth : 20 });
    set({ planeColor: currentMuseum ? currentMuseum.planeColor : "#ffffff" });
    set({ planeStrength: currentMuseum ? currentMuseum.planeStrength : 1 });
    setTextureType(currentMuseum ? currentMuseum.textureIndex : 0)
  }, [currentMuseum]);

  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      getAllFrames();
      getCurrentMuseum();
    }
    return () => (mounted = true);
  }, [frameToTransform]);

  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });
  let [modalType, setModalType] = useState("frame");
  const [textureIndex, setTextureType] = useState(currentMuseum ? currentMuseum.textureIndex : 0);
  const snap = useSnapshot(state);

  return (
    <>
      <button
        className="FrameWorld-save"
        onClick={async () => {
          let response = await MuseumAPI.editMuseumProperty(id, {
            intensity: intensity,
            backgroundColor: backgroundColor,
            fogColor: fogColor,
            planeLength: planeLength,
            planeWidth: planeWidth,
            planeColor: planeColor,
            planeStrength: planeStrength,
            textureIndex: textureIndex
          });
        }}
      >
        {" "}
        Save{" "}
      </button>
      <button
        className="FrameWorld-saveFrame"
        onClick={async () => {
          // let response = await MuseumAPI.editMuseumProperty(id, {
          //   intensity: intensity,
          //   backgroundColor: backgroundColor,
          //   fogColor: fogColor,
          //   planeLength: planeLength,
          //   planeWidth: planeWidth,
          //   planeColor: planeColor,
          //   planeStrength: planeStrength,
          //   textureIndex: textureIndex
          // });
          console.log("let's see the ",currentFrame.current)
        }}
      >
        {" "}
        Save Frame{" "}
      </button>
      <ModalViewer
        Modal={Modal}
        open={open}
        close={close}
        isOpen={isOpen}
        snap={snap}
        modalType={modalType}
      />
      <Controls openModal={open} setModalType={setModalType} />
      <ToggleTransforms dispatch={dispatch} mode={mode} />
      <TextureSelector setTextureType={setTextureType} />
      <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={ref}>
        <ambientLight intensity={intensity} />
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <group position={[0, -0.5, 0]}>
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
                  // queuedFrame.position = [x, GOLDENRATIO / 2, z];
                  queuedFrame.position = [x, y, z];
                  queuedFrame.rotation = [0, 0, 0];
                  queuedFrame.scale =[1,GOLDENRATIO,0.05];
                  queuedFrame.imageZoomRatio = 1;
                  if (isThereQueuedFrame) {
                    dispatch(dequeueFrame(false));
                    dispatch(addFrameToQueue(null));
                    let { type, name, url, text, color, position, rotation,scale,imageZoomRatio } = queuedFrame;
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
            minDistance={5}
            maxDistance={200}
            ref={control}
          />
          <PerspectiveCamera
            makeDefault
            ref={camera}
            fov={70}
            position={[6, 6, 6]}
            aspect={window.innerWidth / window.innerHeight}
          ></PerspectiveCamera>
          <axesHelper />
        </Suspense>
      </Canvas>
    </>
  );
};

export default connect(mapStateToProps)(FrameWorld);
