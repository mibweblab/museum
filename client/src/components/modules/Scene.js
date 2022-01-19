import React, { Suspense, useLayoutEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { HexColorPicker } from "react-colorful";
import { proxy, useSnapshot } from "valtio";
import Controls from "./Controls";
import { connect } from "react-redux";
import Model from "./Ploid";
import GrassCube from "./nature/CubeGrass";
import Tree from "./nature/Tree";

import "./Scene.scss";
import {
  MeshReflectorMaterial,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stage,
  PresentationControls,
} from "@react-three/drei";

import { Physics, useCylinder, usePlane, useBox } from "@react-three/cannon";

import { addObjectToQueue, addGrassCube, addTree, addObject } from "../action";

import { Towers, Bridges, FenceMiddles, FencePieces, FenceCorners } from "./AssetsViewer";

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: "body",
  items: {
    body: "#fff",
    eyes: "#fff",
    clothes: "#fff",
    chest: "#fff",
  },
});

const mapStateToProps = (state) => {
  return {
    grassCubes: state.grassCubes,
    queuedObject: state.queuedObject,
    trees: state.trees,
    towers: state.towers,
    fencePieces: state.fencePieces,
    fenceMiddles: state.fenceMiddles,
    fenceCorners: state.fenceCorners,
    bridges: state.bridges,
  };
};

function Plane({ dispatch, queuedObject, ...props }) {
  const [ref] = usePlane(() => ({
    material: "ground",
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }));
  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((coord) => Math.ceil(coord));
        // console.log(x,y,z);
        // console.log(queuedObject)
        if (queuedObject) {
          queuedObject.position = [x, y, z];
          if (queuedObject.type === "grassCube") {
            dispatch(addGrassCube(queuedObject));
            dispatch(addObjectToQueue(null));
          } else if (queuedObject.type === "tree") {
            // queuedObject.position = [x,y,z]
            dispatch(addTree(queuedObject));
            dispatch(addObjectToQueue(null));
          } else if (queuedObject.type === "tower") {
            dispatch(addObject({ type: "ADD_TOWER", payload: queuedObject }));
          } else if (queuedObject.type === "bridge") {
            dispatch(addObject({ type: "ADD_BRIDGE", payload: queuedObject }));
          } else if (queuedObject.type === "fenceMiddle") {
            dispatch(addObject({ type: "ADD_FENCE_MIDDLE", payload: queuedObject }));
          } else if (queuedObject.type === "fenceCorner") {
            dispatch(addObject({ type: "ADD_FENCE_CORNER", payload: queuedObject }));
          } else if (queuedObject.type === "fencePiece") {
            dispatch(addObject({ type: "ADD_FENCE_PIECE", payload: queuedObject }));
          }
          dispatch(addObjectToQueue(null));
        }
      }}
    >
      <planeGeometry args={[20, 20]} />
      {/* <MeshReflectorMaterial
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
    /> */}
    </mesh>
  );
}

function GrassCubes({ grassCubes, buildState }) {
  return (
    <group
    // ref={ref}
    // onClick={(e) =>
    // e.stopPropagation()
    // ,
    // console.log("this s the id",e.object)
    // setLocation(clicked.current === e.object ? "/" : "/scene/" + e.object._id)
    // }
    // onPointerMissed={() => setLocation("/")}
    >
      {grassCubes.map(
        (props,index) => <GrassCube buildState={buildState} key={index + '-grassCube' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
      )}
    </group>
  );
}

function Trees({ trees }) {
  return (
    <group
    // ref={ref}
    // onClick={(e) =>
    // e.stopPropagation()
    // ,
    // console.log("this s the id",e.object)
    // setLocation(clicked.current === e.object ? "/" : "/scene/" + e.object._id)
    // }
    // onPointerMissed={() => setLocation("/")}
    >
      {trees.map(
        (props,index) => <Tree key={index + '-trees' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
      )}
    </group>
  );
}

const Scene = ({
  grassCubes,
  queuedObject,
  bridges,
  fenceCorners,
  fencePieces,
  fenceMiddles,
  towers,
  trees,
  dispatch,
}) => {
  const control = useRef();
  const camera = useRef();
  const [buildState, setBuildState] = useState("add");

  //   const snap = useSnapshot(state);
  return (
    <div className="Scene">
      <button
        className="btn"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "grassCube", rotation: [0, 0, 0] }));
        }}
      >
        Add Cube
      </button>

      <button
        className="btn-tree"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "tree", rotation: [0, 0, 0] }));
        }}
      >
        Add Tree
      </button>

      <button
        className="btn-tower"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "tower", rotation: [0, 0, 0] }));
        }}
      >
        Add Tower
      </button>

      <button
        className="btn-fence1"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "fencePiece", rotation: [0, 0, 0] }));
        }}
      >
        Add FencePiece
      </button>

      <button
        className="btn-fenceCorner"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "fenceCorner", rotation: [0, 0, 0] }));
        }}
      >
        Add Fence Corner
      </button>

      <button
        className="btn-fenceMiddle"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "fenceMiddle", rotation: [0, 0, 0] }));
        }}
      >
        Add fenceMiddle
      </button>

      <button
        className="btn-bridge"
        onClick={() => {
          dispatch(addObjectToQueue({ type: "bridge", rotation: [0, 0, 0] }));
        }}
      >
        Add Bridge
      </button>

      <button
        className="btn-rotate"
        onClick={() => {
          setBuildState("rotate");
        }}
      >
        Rotate
      </button>

      <button
        className="btn-translate"
        onClick={() => {
          setBuildState("translate");
        }}
      >
        Translate
      </button>

      <Canvas dpr={[1, 2]} shadows>
        <ambientLight intensity={0.5} />
        <color attach="background" args={["#d25578"]} />
        {/* <fog attach="fog" args={["#101010", 10, 20]} /> */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Physics gravity={[0, 10, 0]}>
            <group position={[0, -0.5, 0]}>
              <Model
                //   clothes={snap.items.clothes}
                //   body={snap.items.body}
                //   chest={snap.items.chest}
                //   eyes={snap.items.eyes}
                scale={0.5}
                position={[0, 0, 0]}
                controls={control}
                camera={camera}
              />
              {/* <GrassCube
            //   clothes={snap.items.clothes}
            //   body={snap.items.body}
            //   chest={snap.items.chest}
            //   eyes={snap.items.eyes}
              scale={0.5}
              position={[0, 1, 1]}
              // controls={control}
              // camera = {camera}
            /> */}
              <GrassCubes buildState={buildState} grassCubes={grassCubes} />
              <Trees trees={trees} />
              <Towers towers={towers} />
              <Bridges bridges={bridges} />
              <FenceMiddles fenceMiddles={fenceMiddles} />
              <FencePieces fencePieces={fencePieces} />
              <FenceCorners fenceCorners={fenceCorners} />
              <Plane queuedObject={queuedObject} dispatch={dispatch} />
              {/* <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent color="white" opacity={0.4} />
            </mesh> */}
            </group>
          </Physics>
          <OrbitControls
            makeDefault
            // autoRotate
            // autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2 - 0.05}
            // minPolarAngle={Math.PI / 2.3}
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            enableDamping={true}
            ref={control}
          />

          <PerspectiveCamera
            ref={camera}
            fov={45}
            position={[0, 5, 5]}
            aspect={window.innerWidth / window.innerHeight}
          >
            {/* <spotLight
                position={[-4, 10, -10]}
                angle={0.15}
                penumbra={1}
                intensity={100}
                castShadow
                shadow-mapSize={[2048, 2048]}
              /> */}
          </PerspectiveCamera>
        </Suspense>
      </Canvas>
    </div>
  );
};
export default connect(mapStateToProps)(Scene);
