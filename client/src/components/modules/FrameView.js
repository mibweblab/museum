import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import {useLocation } from "wouter";
import {useFrame} from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { addFrameToTransform , addCurrentFrame,  addCurrentImage} from "../action";


const GOLDENRATIO = 1.61803398875;

const Frame = ({
  _id,
  url,
  name,
  mode,
  frameToTransform,
  type,
  color,
  c = new THREE.Color(),
  dispatch,
  snap,
  ...props
}) => {

  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const image = useRef();
  const [, setLocation] = useLocation();
  const frame = useRef();
  const collective = useRef();
  const meshRef = useRef();
  const frameMesh = useRef();
  const [meshColor,setMeshColor] = useState(color);


  useEffect(() => {
  }, [frameToTransform, mode]);

  useFrame((state) => {
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
  return (
    <group rotation={props.rotation}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true), dispatch(addCurrentFrame(collective)) ,dispatch(addCurrentImage(image)))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
        ref={collective}
        userData={{ isEditable: frameToTransform === _id, mode: mode, name: name,text:props.text,frameMesh: frameMesh , frameImage: image}}
        scale={props.scale}
        position={props.position} 
        onClick={(e) => {
        //   e.stopPropagation();
        //   dispatch(addFrameToTransform(_id));
        //   dispatch(addCurrentFrame(collective));
        //   dispatch(addCurrentImage(image));
        }}
        // onWheel={()=>image.current.material.zoom =image.current.material.zoom - 0.1}
        name={_id}
        // onClick={(e) => (e.stopPropagation(), (state.current = props._id))}
        // If a click happened but this mesh wasn't hit we null out the target,
        // This works because missed pointers fire before the actual hits
        // onPointerMissed={(e) => e.type === "click" && dispatch(addFrameToTransform(""))}
      >
        <boxGeometry />
        <meshStandardMaterial ref={frameMesh} color={color} metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
          zoom={props.imageZoomRatio}
          crossOrigin="anonymous"
        />
      </mesh>
    </group>
  );
};

export default Frame;
