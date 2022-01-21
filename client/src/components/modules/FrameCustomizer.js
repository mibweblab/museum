import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import getUuid from "uuid-by-string";
import "./FrameCustomizer.scss";
import { addFrame, addFrameToQueue, dequeueFrame } from "../action";
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

import Frame from "./Frame";
import { connect } from "react-redux";

import { Dropdown, Button } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";

const options = [
  { key: 0, text: "Static", value: "static" },
  { key: 1, text: "Conversation", value: "conversation" },
  { key: 2, text: "Scene", value: "scene" },
];

import { proxy, useSnapshot } from "valtio";

// const mapStateToProps = state => {
//   return {
//       frames: state.frames
//   }
// }

const state = proxy({
  color: "#fff",
});

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
  const [imageUrl, setImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2FTree.png?alt=media&token=85efad89-f2e9-40ee-b879-1e1effa02a06&auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytes(storageRef, image);
    uploadTask
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {

          // console.log("what the heck",reference.current.toDataURL(downloadURL))
          setImageUrl(downloadURL);
          console.log("File available at", downloadURL);
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
          <color attach="background" args={["#191920"]} />
          <fog attach="fog" args={["#191920", 0, 15]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <group position={[0, -0.5, 0]}>
              <Frame color={shot.color} name={name} url={url} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
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
                  color="pink"
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
        </Canvas>
        {/* <Picker /> */}
      </div>
      <div className={`FrameCustomizer-side${(type == "conversation") ? "-conversation" : ""}`}>
        <div className="FrameCustomizer-group">
          <input className="FrameCustomizer-input" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="FrameCustomizer-group">
          <Dropdown placeholder="Choose Frame Type"  onChange={(_, data) => setType(data.value)} search selection options={options} />
        </div>
        {(type == 'conversation') && // if it's true return the actual JSX
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
              <textarea type="text" placeholder="Who are you speaking to? Please provide a brief bio to better your conversation experience (the better the bio, the better the convo). Max ~100 words." maxLength={500} className="FrameCustomizer-input" onChange={(e) => setDescription(e.target.value)} />
            </div>
          </>
        }
        <div className="FrameCustomizer-group">
          <Picker
            // className="picker"
            // color={color}
            // onChange={(color) => {
            //   setColor(color);
            //   // console.log("current color: ", snap.current, state.items[snap.current], color);
            // }}
          />
        </div>

        <div className="FrameCustomizer-group">
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload Image</Button>
        </div>
        <div className="FrameCustomizer-group">
          <button
            className="FrameCustomizer-button"
            onClick={() => {
              dispatch(addFrameToQueue({ name: name, url: pexel(1103970), color: shot.color, type: type, text: "", firstName: firstName, lastName: lastName, description:description }));
              dispatch(dequeueFrame(true));
              close();
            }}
          >
            Add Frame
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect()(FrameCustomizer);