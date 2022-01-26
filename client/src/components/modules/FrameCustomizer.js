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

import { connect } from "react-redux";

import { Dropdown, Button } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { useRoute, useLocation } from "wouter";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import { proxy, useSnapshot } from "valtio";
import { MeshBasicMaterial } from "three";

import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";

const options = [
  { key: 0, text: "Static", value: "static" },
  { key: 1, text: "Conversation", value: "premade_conversation" },
];

const figureOptions = [
  { key: 0, text: "Shakespeare", value: Shakespeare },
  { key: 1, text: "Einstein", value: Einstein },
  { key: 2, text: "Musk", value: Musk },
  { key: 3, text: "Create your own figure", value: UserUpload },
];

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
  const [frameText, setFrameText] = useState("");

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);
  // const [image, setImage] = useState(null);
  const [targetObjectUrl, setTargetObjectUrl] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
      // setTargetObjectUrl(URL.createObjectURL(image));
    }
  };

  // text length errors
  const [nameCharacterLength, setCharacterLength] = useState(0);
  const [firstNameCharacterLength, setFirstNameCharacterLength] = useState(0);
  const [lastNameCharacterLength, setLastNameCharacterLength] = useState(0);
  const [figureDescriptionCharacterLength, setFigureDescriptionCharacterLength] = useState(0);
  const [descriptionCharacterLength, setDescriptionCharacterLength] = useState(0);
  const [frameTextCharacterLength, setFrameTextCharacterLength] = useState(0);

  // text field errors
  const [isFrameTextError, setFrameTextError] = useState(false);
  const [isNameError, setNameError] = useState(false);
  const [isFirstNameError, setFirstNameError] = useState(false);
  const [isLastNameError, setLastNameError] = useState(false);
  const [isFigureDescriptionError, setFigureDescriptionError] = useState(false);
  const [isDescriptionError, setDescriptionError] = useState(false);


  //snack bar alerts

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };


  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytes(storageRef, image);
    uploadTask
      .then((snapshot) => {
        console.log(snapshot);
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
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
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <div className="FrameCustomizer-title">ADD FRAME</div>
      <div className="FrameCustomizer-wrapper">
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
        <div
          className={`FrameCustomizer-side${
            type == "conversation" || type == "premade_conversation" ? "-conversation" : ""
          }`}
        >
          <div className="FrameCustomizer-group">
            <TextField
              error={isNameError}
              onChange={(e) => {
                if (e.target.value.length <= 40) {
                  setName(e.target.value);
                  setCharacterLength(e.target.value.length);
                  setNameError(false);
                } else {
                  setNameError(true);
                }
              }}
              fullWidth
              id="fullWidth"
              placeholder="Frame Name"
              label="Frame Name"
              variant="standard"
              helperText={nameCharacterLength + " / 40"}
            />
          </div>

          <div className="FrameCustomizer-group">
            <TextField
              error={isFrameTextError}
              id="standard-multiline-static"
              label="Frame Description"
              multiline
              rows={4}
              fullWidth
              placeholder="A brief description about the frame"
              variant="standard"
              className="Card-field"
              helperText={frameTextCharacterLength + " /400"}
              onChange={(e) => {
                if (e.target.value.length <= 400) {
                  setFrameText(e.target.value);
                  setFrameTextCharacterLength(e.target.value.length);
                  setFrameTextError(false);
                } else {
                  setFrameTextError(true);
                }
              }}
            />
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
          {(type === "premade_conversation" || type === "conversation") && ( // if it's true return the actual JSX
            <div className="FrameCustomizer-group  FrameCustomizer-figureGroup">
              <Dropdown
                placeholder="Select Figure"
                className="FrameCustomizer-input"
                onChange={(_, data) => {
                  if (data.value == 3) {
                    setType("conversation");
                  }
                  setFigure(data.value);
                }}
                search
                selection
                options={figureOptions}
              />
              {figure == UserUpload ? (
                <>
                  <div className="FrameCustomizer-group">
                    <TextField
                      error={isFirstNameError}
                      onChange={(e) => {
                        if (e.target.value.length <= 40) {
                          setFirstName(e.target.value);
                          setFirstNameCharacterLength(e.target.value.length);
                          setFirstNameError(false);
                        } else {
                          setFirstNameError(true);
                        }
                      }}
                      fullWidth
                      // sx={{height: 20}}
                      id="fullWidth"
                      placeholder="First Name"
                      label="Figure First Name"
                      variant="standard"
                      // className="fRAME-textField"
                      helperText={firstNameCharacterLength + " / 40"}
                    />
                  </div>
                  <div className="FrameCustomizer-group">
                    <TextField
                      error={isLastNameError}
                      onChange={(e) => {
                        if (e.target.value.length <= 40) {
                          setLastName(e.target.value);
                          setLastNameCharacterLength(e.target.value.length);
                          setLastNameError(false);
                        } else {
                          setLastNameError(true);
                        }
                      }}
                      fullWidth
                      id="fullWidth"
                      placeholder="Last Name"
                      label="Figure Last Name"
                      variant="standard"
                      helperText={lastNameCharacterLength + " / 40"}
                    />
                  </div>
                  <div className="FrameCustomizer-group">
                    <TextField
                      error={isDescriptionError}
                      id="standard-multiline-static"
                      label="Figure Description"
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Who are you speaking to? Please provide a brief bio to better your conversation experience (the better the bio, the better the convo)"
                      variant="standard"
                      className="Card-field"
                      helperText={descriptionCharacterLength + " /100"}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setDescription(e.target.value);
                          setDescriptionCharacterLength(e.target.value.length);
                          setDescriptionError(false);
                        } else {
                          setDescriptionError(true);
                        }
                      }}
                    />
                  </div>
                </>
              ) : null}
            </div>
          )}
          <div className="FrameCustomizer-group">
            <input type="file" className="MuseumForm-inputFile" onChange={handleChange} />
            <button className="MuseumForm-uploadButton" onClick={handleUpload}>
              Image
              <img
                className="MuseumForm-uploadImage"
                src="https://img.icons8.com/external-bearicons-blue-bearicons/64/000000/external-upload-call-to-action-bearicons-blue-bearicons.png"
              />
            </button>
          </div>

          <div className="FrameCustomizer-group">
            <button
              className="FrameCustomizer-button"
              onClick={() => {
                if (firstNameCharacterLength === 0 && type === "conversation") {
                  setFirstNameError(true);
                } 
                // else {
                //   setFirstNameError(false);
                // }

                if (type === "conversation" && lastNameCharacterLength === 0) {
                  setLastNameError(true);
                } 
                // else {
                //   setLastNameError(false);
                // }

                if (type === "conversation" && descriptionCharacterLength === 0) {
                  setDescriptionError(true);
                } 
                
                // else {
                //   setDescriptionError(false);
                // }

                if (nameCharacterLength === 0) {
                  setNameError(true);
                } 
                
                // else {
                //   setNameError(false);
                // }

                if (frameTextCharacterLength === 0) {
                  setFrameTextError(true);
                } 

                // console.log("this is the length of the frame ",frameTextCharacterLength)
                
                // else {
                //   setFrameTextError(false);
                // }

                let generalPass = !(nameCharacterLength === 0 || frameTextCharacterLength === 0);
                let conversationFilterPass = !(
                  type === "conversation" &&
                  (firstNameCharacterLength === 0 ||
                    lastNameCharacterLength === 0 ||
                    descriptionCharacterLength === 0)
                );

                if (conversationFilterPass && generalPass) {
                  dispatch(
                    addFrameToQueue({
                      name: name,
                      url: imageUrl,
                      color: shot.color,
                      type: type,
                      text: frameText,
                      figure: figure,
                      firstName: firstName,
                      lastName: lastName,
                      description: description,
                    })
                  );
                  dispatch(dequeueFrame(true));
                  setOpenSnackBar(true);
                  setSnackBarMessage("Click on the plane to add frame");
                  setTimeout(close,5000);
                } else {
                }
              }}
            >
              Add Frame
            </button>
            <button className="FrameCustomizer-button" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(FrameCustomizer);
