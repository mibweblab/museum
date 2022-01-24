import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useCursor, Image, Text } from "@react-three/drei";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useCursor, Image, Text, TransformControls } from "@react-three/drei";
import { useControls, folder } from "leva";
import { snapshot } from "valtio";
import { addFrameToTransform , addCurrentFrame,  addCurrentImage} from "../action";
// import { connect, useSelector, useDispatch } from "react-redux";


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
    console.log("my user data", collective.current.userData);
  }, [frameToTransform, mode]);

  useFrame((state) => {
    // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
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
        // data-id={props._id}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
        ref={collective}
        userData={{ isEditable: frameToTransform === _id, mode: mode, name: name,text:props.text,frameMesh: frameMesh , frameImage: image}}
        // onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        // onPointerOut={() => hover(false)}
        // scale={[1, GOLDENRATIO, 0.05]}
        scale={props.scale}
        position={props.position} 
        // position={[0, GOLDENRATIO / 2, 0]}
      
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addFrameToTransform(_id));
          dispatch(addCurrentFrame(collective));
          dispatch(addCurrentImage(image));

          e.stopPropagation() 
          if (type == "conversation") {
            setLocation("/room/" + props._id) 
          } else if (type == "premade_conversation") {
            setLocation("/room_" + props.figure) 
          } else if (type == "scene") {
            setLocation("/scene/" + props._id) 
          }
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
          // material={}
          zoom={props.imageZoomRatio}
          crossOrigin="anonymous"
          // scale={[0.1,0.1,0.1]}
        />
      </mesh>

      {/* <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split("-").join(" ")}
      </Text> */}
      {/* {mode !== "" && frameToTransform === _id && (
        <TransformControls
          makeDefault
          onChange={(e) => {
            console.log(e)
            if (mode === "translate") {
              set({
                x: collective.current.position.x,
                y: collective.current.position.y,
                z: collective.current.position.z,
              });
            } else if (mode === "rotate") {
              set({
                xAngleRad: collective.current.rotation.x,
                yAngleRad: collective.current.rotation.y,
                zAngleRad: collective.current.rotation.z,
              });
            } else if (mode === "scale") {
              set({
                xScale: collective.current.scale.x,
                yScale: collective.current.scale.y,
                zScale: collective.current.scale.z,
              });
            }
          }}
          mode={mode === "" ? "translate" : mode}
          object={collective.current}
          position={collective.current.position}
        />
      )} 
      
      */}
    </group>
  );
};

export default Frame;
