import React, { Suspense, useEffect, useRef, useState } from "react";
import "./MuseumForm.scss";
import { Input, Button, Dropdown, TextArea } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { connect } from "react-redux";
import { addMuseum } from "../action";

import MuseumAPI from "../../api/museum";

// const mapStateToProps = (state) => {
//   return {
// frames: state.frames,
// queuedFrame: state.queuedFrame,
// isThereQueuedFrame: state.isThereQueuedFrame,
// museums: state.museums
//   };
// };

const MuseumForm = ({ dispatch }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const options = [
    { key: "form-pr-1", value: true, text: "Private" },
    { key: "form-pr-12", value: false, text: "Public" },
  ];

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
          setImageUrl(downloadURL);
          console.log("File available at", downloadURL);
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="MuseumForm">
      <div className="MuseumForm-group">
        <Input onChange={(_, data) => setName(data.value)} placeholder="Name" />
      </div>
      <div className="MuseumForm-group">
        <TextArea
          onChange={(_, data) => setDescription(data.value)}
          placeholder="Tell us more"
          style={{ minHeight: 100 }}
        />
      </div>
      <div className="MuseumForm-group">
        <Dropdown
          onChange={(_, data) => setPrivate(data.value)}
          search
          selection
          placeholder="Privacy"
          options={options}
        />
      </div>
      <div className="MuseumForm-group">
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>Upload Image</Button>
      </div>
      <div className="MuseumForm-group">
        <Button
          onClick={async () => {
            if (name && description) {
              let museum = await MuseumAPI.addMuseum(name, description, isPrivate, imageUrl);
              if (museum) {
                dispatch(addMuseum(museum.data));
              }
            }
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default connect()(MuseumForm);
