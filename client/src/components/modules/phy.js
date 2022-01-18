import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";

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

import { Physics, useCylinder, usePlane, useBox } from "@react-three/cannon";

import { useRoute, useLocation } from "wouter";
import getUuid from "uuid-by-string";
import Model from "./Ploid";
const GOLDENRATIO = 1.61803398875;

function Frame({ url, c = new THREE.Color(), ...props }) {
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const image = useRef();
  const frame = useRef();
  const name = getUuid(url);
  useCursor(hovered);

  useFrame((state) => {
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    image.current.scale.x = THREE.MathUtils.lerp(
      image.current.scale.x,
      0.85 * (hovered ? 0.85 : 1),
      0.1
    );
    image.current.scale.y = THREE.MathUtils.lerp(
      image.current.scale.y,
      0.9 * (hovered ? 0.905 : 1),
      0.1
    );
    frame.current.material.color.lerp(
      c.set(hovered ? "orange" : "white").convertSRGBToLinear(),
      0.1
    );
  });

  const [ref, api] = useBox(
    () => ({
      // mass:20,
      // position:[0.04, 0.3, -0.34],
      // rotation:[1.33, -0.02, -0.06],
      // args:[],
      // allowSleep: false,
      // onCollide: (e) => console.log("bonk", e.body.userData),
      ...props,
    }),
    ref
  );

  return (
    // <group {...props}>

      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        // position={[0, 0, 0]}
        ref={ref}
        api={api}
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}   >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      
      // <Text
      //   maxWidth={0.1}
      //   anchorX="left"
      //   anchorY="top"
      //   position={[0.55, GOLDENRATIO, 0]}
      //   fontSize={0.025}
      // >
      //   {name.split("-").join(" ")}
      // </Text>


    // </group>
  );
}

function Frames({ camera, images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
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
      onClick={(e) => (
        e.stopPropagation(),
        setLocation(clicked.current === e.object ? "/" : "/item/" + e.object.name)
      )}
      onPointerMissed={() => setLocation("/")}
    >
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  );
}


function Plane(props) {
  const [ref] = usePlane(() => ({ material: 'ground', type: 'Static',rotation: [-Math.PI / 2, 0, 0],...props }))
  return (
    <mesh ref={ref}>
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
  )
}


const FrameWorld = ({ images }) => {
  const control = useRef();
  const camera = useRef();
  const ref = useRef();

  // if (ref.current && camera.current){
  //   const controls = new OrbitControls(camera.current, ref.current)
  // }

  return (
    <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={ref}>
      <color attach="background" args={["#191920"]} />
      <fog attach="fog" args={["#191920", 0, 15]} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <group>
          <Physics>
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
            <Frames camera={camera} images={images} />
            <Plane/>

          </Physics>
        </group>
        <OrbitControls
          makeDefault
          // autoRotate
          // autoRotateSpeed={0.3}
          // maxPolarAngle={Math.PI / 2 - 0.05}
          // minPolarAngle={Math.PI / 2.3}
          // enableZoom={true}
          // enablePan={false}
          // minDistance={5}
          // maxDistance={200}
          // enableDamping={true}
          ref={control}
        />

        <PerspectiveCamera
          ref={camera}
          fov={70}
          position={[0, 2, 15]}
          aspect={window.innerWidth / window.innerHeight}
        ></PerspectiveCamera>
      </Suspense>
    </Canvas>
  );
};

export default FrameWorld;
