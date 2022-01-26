import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import "./FrameWorld.scss";
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
// import API from "../../api/museum";
import ConversationAPI from  "../../api/conversation";
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

  let [currentFrameData, setFrameData] = useState({
    name: "Click on a Frame",
    text: "You will see frame details when you click on a frame",
  });

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

  const [{ frameColor, frameImageZoom }, setFrame] = useControls(() => ({
    framePosX: {
      value: transformRef.current ? transformRef.current.object.position.x : 0,
      onChange: (x) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.position.x = x;
          }
        }
      },
    },
    framePosY: {
      value: transformRef.current ? transformRef.current.object.position.y : 0,
      onChange: (y) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.position.y = y;
          }
        }
      },
    },
    framePosZ: {
      value: transformRef.current ? transformRef.current.object.position.z : 0,
      onChange: (z) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.position.z = z;
          }
        }
      },
    },
    frameRotateX: {
      value: transformRef.current ? transformRef.current.object.rotation.x : 0,
      onChange: (x) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.rotation.x = x;
          }
        }
      },
    },
    frameRotateY: {
      value: transformRef.current ? transformRef.current.object.rotation.y : 0,
      onChange: (y) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.rotation.y = y;
          }
        }
      },
    },
    frameRotateZ: {
      value: transformRef.current ? transformRef.current.object.rotation.z : 0,
      onChange: (z) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.rotation.z = z;
          }
        }
      },
    },

    frameXScale: {
      value: transformRef.current ? transformRef.current.object.scale.x : 1,
      onChange: (x) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.scale.x = x;
          }
        }
      },
    },
    frameYScale: {
      value: transformRef.current ? transformRef.current.object.scale.y : 1,
      onChange: (y) => {
        let userData = currentFrame ? currentFrame.current?.userData : null;
        if (userData) {
          let { isEditable, mode } = userData;
          if (mode !== "" && isEditable) {
            transformRef.current.object.scale.y = y;
          }
        }
      },
    },

    frameImageZoom: {
      value: transformRef.current
        ? transformRef.current.object.userData.frameImage.current
          ? transformRef.current.object.userData.frameImage.current.material.zoom
          : 0
        : 0,
      min: -5,
      max: 5,
      step: 0.1,
      onChange: (v) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable } = userData;
          if (isEditable) {
            if (userData.frameImage.current) {
              userData.frameImage.current.material.zoom = v;
            }
          }
        }
      },
    },
    frameColor: {
      value: transformRef.current ? transformRef.current.object.userData.color : "#ffffff",
      onChange: (v) => {
        let userData = transformRef.current ? transformRef.current.object.userData : null;
        if (userData) {
          let { isEditable } = userData;
          if (isEditable) {
            let { frameMesh } = transformRef.current.object.userData;
            if (frameMesh) {
              if (frameMesh.current) {
                frameMesh.current.color = new THREE.Color(v);
              }
            }
          }
        }
      },
    },
  }));

  useEffect(() => {
    set({ intensity: currentMuseum ? currentMuseum.intensity : 1 });
    set({ backgroundColor: currentMuseum ? currentMuseum.backgroundColor : "#ffffff" });
    set({ planeLength: currentMuseum ? currentMuseum.planeLength : 20 });
    set({ planeWidth: currentMuseum ? currentMuseum.planeWidth : 20 });
    set({ planeColor: currentMuseum ? currentMuseum.planeColor : "#ffffff" });
    set({ planeStrength: currentMuseum ? currentMuseum.planeStrength : 1 });
    setTextureType(currentMuseum ? currentMuseum.textureIndex : 0);

    setFrame({ framePosX: transformRef.current ? transformRef.current.object.position.x : 0 });
    setFrame({ framePosY: transformRef.current ? transformRef.current.object.position.y : 0 });
    setFrame({ framePosZ: transformRef.current ? transformRef.current.object.position.z : 0 });
    setFrame({ frameRotateX: transformRef.current ? transformRef.current.object.rotation.x : 0 });
    setFrame({ frameRotateY: transformRef.current ? transformRef.current.object.rotation.y : 0 });
    setFrame({ frameRotateZ: transformRef.current ? transformRef.current.object.rotation.z : 0 });
    setFrame({ frameXScale: transformRef.current ? transformRef.current.object.scale.y : 1 });
    setFrame({ frameYScale: transformRef.current ? transformRef.current.object.scale.y : 1 });
    setFrame({
      frameColor:
        "#" + transformRef?.current?.object?.userData?.frameMesh?.current?.color.getHexString(),
    });

    setFrame({
      frameImageZoom: transformRef?.current?.object?.userData?.frameImage?.current?.material?.zoom,
    });

    if (frameToTransform) {
      let currentFramesList = frames.filter((frame) => frame._id === frameToTransform);
      if (currentFramesList.length > 0) {
        setFrameData({ name: currentFramesList[0].name, text: currentFramesList[0].text });
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

  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });
  let [modalType, setModalType] = useState("frame");
  const [textureIndex, setTextureType] = useState(currentMuseum ? currentMuseum.textureIndex : 0);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const snap = useSnapshot(state);



  return (
    <>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
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
            textureIndex: textureIndex,
          });

          if (response) {
            setOpenSnackBar(true);
            setSnackBarMessage("Successfully updated frame property");
          }

          let obj = {
            position: [
              transformRef.current ? transformRef.current.object.position.x : 0,
              transformRef.current ? transformRef.current.object.position.y : 0,
              transformRef.current ? transformRef.current.object.position.z : 0,
            ],
            rotation: [
              transformRef.current ? transformRef.current.object.rotation.x : 0,
              transformRef.current ? transformRef.current.object.rotation.y : 0,
              transformRef.current ? transformRef.current.object.rotation.z : 0,
            ],
            scale: [
              transformRef.current ? transformRef.current.object.scale.x : 1,
              transformRef.current ? transformRef.current.object.scale.y : 1,
              transformRef.current ? transformRef.current.object.scale.z : 1,
            ],
            frameColor:
              "#" +
              transformRef?.current?.object?.userData?.frameMesh?.current?.color.getHexString(),
            imageZoomRatio: transformRef.current
              ? transformRef.current.object.userData.frameImage.current
                ? transformRef.current.object.userData.frameImage.current.material.zoom
                : 0
              : 0,
          };

          console.log(obj);

          // let color = transformRef?.current?.object?.userData?.frameMesh?.current?.color;
          // if (color){
          //   console.log("let's color", transformRef?.current?.object?.userData?.frameMesh?.current?.color.getHexString())
          //   // console.log(color.getHexString())
          // }
          // console.log("I'm here", transformRef.current)
          if (transformRef.current) {
            if (transformRef.current.object.userData) {
              if (transformRef.current.object.userData.isEditable) {
                console.log("this is the ibject tryna save", obj);
                let frameResponse = await APIInterface.editFrameProperty(
                  transformRef.current.object.name,
                  obj
                );
              }
            }
          }
        }}
      >
        {" "}
        Save{" "}
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
      <FrameCard
        dispatch={dispatch}
        currentFrame={currentFrame}
        name={currentFrame?.current?.userData?.name}
        text={currentFrame?.current?.userData?.text}
        parentId={id}
        frameToTransform={frameToTransform}
      />
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
                      figure,
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
                      id,
                      figure,
                    );
                    if (type=='conversation'){
                        await ConversationAPI.addConversation(firstName, lastName, description, response.data._id, url) 
                    }
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