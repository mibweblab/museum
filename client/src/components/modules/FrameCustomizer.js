import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import getUuid from "uuid-by-string";
import "./FrameCustomizer.scss";
import { addFrame, addFrameToQueue, dequeueFrame } from "../action";
import { Shakespeare, Einstein, Musk, UserUpload } from "../../HumanModel.js";
import { HexColorPicker } from "react-colorful";
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

import { CircularProgressbar } from "react-circular-progressbar";

import { connect } from "react-redux";

import { Dropdown, Button } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { useRoute, useLocation } from "wouter";

const options = [
  { key: 0, text: "Static", value: "static" },
  { key: 1, text: "Conversation", value: "premade_conversation" },
  { key: 2, text: "Scene", value: "scene" },
];

const figureOptions = [
  { key: 0, text: "Shakespeare", value: Shakespeare },
  { key: 1, text: "Einstein", value: Einstein },
  { key: 2, text: "Scene", value: Musk },
  { key: 3, text: "Create your own figure", value: UserUpload },
  
];

import { proxy, useSnapshot } from "valtio";
import { MeshBasicMaterial } from "three";

const state = proxy({
  color: "#ffffff",
});

const GOLDENRATIO = 1.61803398875;

const Frame = ({ url, name, type, color, c = new THREE.Color(), ...props }) => {
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const image = useRef();
  const [, setLocation] = useLocation();
  const frame = useRef();
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

  return (
    <group {...props}>
      <mesh name={name} scale={[1, GOLDENRATIO, 0.05]} position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
          crossOrigin="anonymous"
        />
      </mesh>
    </group>
  );
};

function Picker() {
  const snap = useSnapshot(state);
  return (
    <HexColorPicker
      className="picker"
      color={snap.color}
      onChange={(color) => {
        state.color = color;
      }}
    />
  );
}

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

// https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260

const FrameCustomizer = ({ snap, dispatch, close }) => {
  const control = useRef();
  const camera = useRef();
  const reference = useRef();

  const url = pexel(1103970);
  const [name, setName] = useState(getUuid(url));
  // const [color, setColor] = useState("#fff");
  const shot = useSnapshot(state);
  const [type, setType] = useState("scene");
  const [figure, setFigure] = useState(-1);
  // const [imageUrl, setImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2FTree.png?alt=media&token=85efad89-f2e9-40ee-b879-1e1effa02a06&auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);
  const [image, setImage] = useState(null);
  const [targetObjectUrl, setTargetObjectUrl] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
      // setTargetObjectUrl(URL.createObjectURL(image));
    }
  };

  // useFrame((state) => {
  //   imageRef.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
  //   imageRef.current.scale.x = THREE.MathUtils.lerp(
  //     imageRef.current.scale.x,
  //     0.85 * (hovered ? 0.85 : 1),
  //     0.1
  //   );
  //   imageRef.current.scale.y = THREE.MathUtils.lerp(
  //     imageRef.current.scale.y,
  //     0.9 * (hovered ? 0.905 : 1),
  //     0.1
  //   );
  //   frameRef.current.material.color.lerp(
  //     c.set(hovered ? "orange" : "white").convertSRGBToLinear(),
  //     0.1
  //   );
  // });

  const [color, setColor] = useState("#fff");

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytes(storageRef, image);
    uploadTask
      .then((snapshot) => {
        console.log(snapshot)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          // if (downloadURL){


          // }
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="FrameCustomizer">
      <div className="FrameCustomizer-canvas">
        <Canvas gl={{ alpha: false }} dpr={[1, 2]} ref={reference} crossOrigin="anonymous">
          <color attach="background" args={[shot.color]} />
          <fog attach="fog" args={["#191920", 0, 15]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <group position={[0, -0.5, 0]}>
              <Frame color={shot.color} name={name} url={imageUrl} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={60}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#ffffff"
                  metalness={0.5}
                />
              </mesh>
            </group>
            <OrbitControls makeDefault ref={control} />
            <PerspectiveCamera
              makeDefault
              ref={camera}
              fov={70}
              position={[2, 1, 2]}
              aspect={window.innerWidth / window.innerHeight}
            ></PerspectiveCamera>
          </Suspense>
        </Canvas>
      </div>
      <div className={`FrameCustomizer-side${(type == "conversation" || type == "premade_conversation") ? "-conversation" : ""}`}>
        <div className="FrameCustomizer-group">
          <input className="FrameCustomizer-input" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="FrameCustomizer-group">
          <Dropdown
            className="FrameCustomizer-input"
            placeholder="Choose Frame Type"
            onChange={(_, data) => setType(data.value)}
            search
            selection
            options={options}
          />
        </div>
        {(type == 'premade_conversation' || type == 'conversation') && // if it's true return the actual JSX
            <>
            <Dropdown placeholder="Select Figure"  onChange={(_, data) => {
                                                              if (data.value == 3) { setType("conversation")};  
                                                              setFigure(data.value);
                                                              }} search selection options={figureOptions}/>
            {(figure == UserUpload) ?  (
            <>
            <div >
              <label>First Name</label>
              <input type="text" className="FrameCustomizer-input" onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div >
              <label>Last Name</label>
              <input type="text" className="FrameCustomizer-input" onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label>Description</label>
              <textarea type="text" placeholder="Who are you speaking to? Please provide a brief bio to better your conversation experience (the better the bio, the better the convo). Max ~100 words." maxLength={500} className="FrameCustomizer-input" onChange={(e) => setDescription(e.target.value)}/>
            </div> </>
            ): null }
          </>
        }
        <div className="FrameCustomizer-group">
          <textarea
            className="FrameCustomizer-textArea"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="FrameCustomizer-group">
          {/* <div className="FrameCustomizer-preview">
            <img className="FrameCustomizer-imgPreview" src={targetObjectUrl} />
          </div> */}
          <input type="file" onChange={handleChange} />
          <Button onClick={handleUpload}>Upload Image</Button>
        </div>
        {showErrorMessage && (<label>Please fill in full name and description fields.</label>)}
        <div className="FrameCustomizer-group">
          <button
            className="FrameCustomizer-button"
            onClick={() => {
              if ((type == "conversation") && ((firstName == "") || (lastName == "") || (description == ""))) {
                setShowErrorMessage(true)
              } else {
              dispatch(addFrameToQueue({ name: name, url: imageUrl, color: shot.color, type: type, text: "", figure: figure, firstName: firstName, lastName: lastName, description:description }));
              dispatch(
                addFrameToQueue({
                  name: name,
                  url: imageUrl,
                  color: shot.color,
                  type: type,
                  text: "",
                })
              );
              dispatch(dequeueFrame(true));
              // URL.revokeObjectURL(targetObjectUrl); // free memory
              // setTargetObjectUrl("");
              close();
            }}}
          >
            Add Frame
          </button>
          <button
            className="FrameCustomizer-button"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(FrameCustomizer);