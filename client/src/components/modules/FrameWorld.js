import * as THREE from "three";
import { Vector3 } from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Billboard } from "@react-three/drei";
import "./FrameWorld.scss";
import { useModal } from "react-hooks-use-modal";
import { CycleRaycast } from "@react-three/drei";
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

import { proxy, snapshot, useSnapshot } from "valtio";
import { connect } from "react-redux";
import { addFrame, dequeueFrame } from "../action";

const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
    moveObject: state.moveObject
  };
};

// import { Physics, useCylinder, usePlane } from '@react-three/cannon'

import { useRoute, useLocation } from "wouter";
import getUuid from "uuid-by-string";
import Model from "./Ploid";
import Frame from "./Frame";
import Controls from "./Controls";
import FrameCustomizer from "./FrameCustomizer";
import { addFrameToQueue ,  addMoveObject } from "../action";
import APIInterface from "../../api";

const GOLDENRATIO = 1.61803398875;

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  frameExists: false,
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function Frames({ images, grassCubes , q = new THREE.Quaternion(),dispatch, p = new THREE.Vector3() }) {
  // console.log("I got these images",images)
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);

      console.log("I clicked");
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });
  useFrame((state, dt) => {
    // console.log("before",camera.current.position)
    // console.log("before",camera.current.quaternion)
    // state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt));
    // state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt));
    // console.log("after",camera.current.position)
    // console.log("after",camera.current.quaternion)
  });

  return (
    <group
      ref={ref}
      onClick={(e) =>
        e.stopPropagation()
        // ,
        // console.log("this s the id",e.object)
        // setLocation(clicked.current === e.object ? "/" : "/scene/" + e.object._id)
      }
      onPointerMissed={() => setLocation("/")}
    >
      {images.map(
        (props,index) => <Frame key={index + '-frame' }dispatch={dispatch} position={props.position} rotation={props.rotation} url={props.imageUrl} color={props.frameColor} name={props.name} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}

const ModalViewer = ({ Modal, open, close, isOpen, modalType }) => {
  const snap = useSnapshot(state);
  return (
    <Modal>
      <div className="ModalViewer">
        <div className="ModalViewer-header"></div>
        <div className="ModalViewer-body">
          {modalType === "frame" && <FrameCustomizer close={close} snap={snap} />}
        </div>
        <div className="ModalViewer-footer">
          <button onClick={close}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

const FrameWorld = ({ images, frames, queuedFrame, moveObject, dispatch, isThereQueuedFrame }) => {
  // console.log("I'm inside frames",frames)
  const control = useRef();
  const camera = useRef();
  const ref = useRef();
  const [{ objects, cycle }, set] = useState({ objects: [], cycle: 0 });

  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  let [modalType, setModalType] = useState("frame");

  useEffect(() => {
    console.log(objects, cycle);
  }, [objects, cycle]);

  return (
    <>
      <ModalViewer Modal={Modal} open={open} close={close} isOpen={isOpen} modalType={modalType} />
      <Controls openModal={open} setModalType={setModalType} />
      <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={ref}>
        <color attach="background" args={["#fff"]} />
        <fog attach="fog" args={["#191920", 0, 15]} />
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
            {<Frames dispatch={dispatch} camera={camera} images={frames} />}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
              name="ground"
              onPointerMove={(e) => {
                e.stopPropagation();

                // console.log("here is the onj",moveObject)
                const [x, y, z] = Object.values(e.point).map((coord) => coord)
                
                // console.log(x,y,z);
                moveObject.position.x = x;
                // moveObject.position.y = y;
                moveObject.position.z = z;
                // objects.forEach((obj) => {
                //   if (obj.object.name !== "ground") {
                    // moveObject.position.x = x;
                    // moveObject.position.y = y;
                    // moveObject.position.z = z;
                //   }
                // });
                // console.log(x, y, z);
              }}

              onDoubleClick={()=> dispatch(addMoveObject(null))}
              onClick={(e) => {
                e.stopPropagation();
                const [x, y, z] = Object.values(e.point).map((coord) => Math.ceil(coord));
                // addCube(x, y, z, activeTexture);
                // queuedFrame.position = [x, y, z];
                // queuedFrame.rotation = [0, 0, 0];
                // if (isThereQueuedFrame) {
                //   //  console.log()
                //   dispatch(addFrame(queuedFrame));
                //   dispatch(dequeueFrame(false));
                  // dispatch(addMoveObject(null));

                //   let { type, name, url, text, color, position, rotation } = queuedFrame;
                //   APIInterface.addFrame(type, name, url, text, color, position, rotation);
                // }
                // moveObject.position.x = x;
                // moveObject.position.y = y;
                // moveObject.position.z = z;
              }}
            >
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
        <CycleRaycast onChanged={(objects, cycle) => set({ objects, cycle })} />
      </Canvas>
    </>
  );
};

// connect(mapStateToProps)(Frames)

export default connect(mapStateToProps)(FrameWorld);
