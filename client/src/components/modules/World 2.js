import React, { Suspense, useLayoutEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { HexColorPicker } from "react-colorful";
import { proxy, useSnapshot } from "valtio";



import Model from "./Ploid";
import "./World.scss";
import {
  MeshReflectorMaterial,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stage,
  PresentationControls,
} from "@react-three/drei";

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

function Picker() {
  const snap = useSnapshot(state);
  return (
    <>
      <HexColorPicker
        className="picker"
        color={snap.items[snap.current]}
        onChange={(color) => {
          state.items[snap.current] = color;
          // console.log("current color: ", snap.current, state.items[snap.current], color);
        }}
      />
      <h1>{snap.current}</h1>
    </>
  );
}

function ToggleColor() {
  return (
    <div className="World-parts">
      <div className="World-partsHeader">
        <span
          onClick={() => {
            state.current = "clothes";
            console.log("current is clothes", state.current);
          }}
          className="World-part"
        >
          Clothes
        </span>
        <span
          onClick={() => {
            state.current = "body";
            console.log("current is body", state.current);
          }}
          className="World-part"
        >
          Body
        </span>
        <span
          onClick={() => {
            state.current = "chest";
            console.log("current is chest", state.current);
          }}
          className="World-part"
        >
          Chest
        </span>
        <span
          onClick={() => {
            state.current = "eyes";
            console.log("current is eyes", state.current);
          }}
          className="World-part"
        >
          Eyes
        </span>
      </div>
      <div className="World-partsBody">
        <Picker />
      </div>
    </div>
  );
}


const World = () => {
  const control = useRef();
  const camera = useRef()
  const snap = useSnapshot(state);
  return (
    <div className="World">
      <ToggleColor />
      <Canvas dpr={[1, 2]} shadows>
        <ambientLight intensity={0.5} />
        <color attach="background" args={["#d25578"]} />
        <fog attach="fog" args={["#101010", 10, 20]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <group position={[0, -0.5, 0]}>
            <Model
              clothes={snap.items.clothes}
              body={snap.items.body}
              chest={snap.items.chest}
              eyes={snap.items.eyes}
              scale={0.5}
              position={[0, 0, 0]}
              controls={control}
              camera = {camera}
            />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[12, 12]} />
              <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                opacity={4}
                depthScale={1.1}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.25}
                roughness={1}
              />
            </mesh>
            <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent color="black" opacity={0.4} />
            </mesh>
          </group>

          <OrbitControls
            makeDefault
            // autoRotate
            // autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2 - 0.05}
            // minPolarAngle={Math.PI / 2.3}
            // enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            enableDamping={true}
            ref={control}
          />

          <PerspectiveCamera ref={camera} fov={45} position={[0, 5, 5]} aspect={window.innerWidth/window.innerHeight}>
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
export default World;