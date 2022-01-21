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

const addRandomImageUrl = () => {
  
  const imgUrls = ['https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext1.png?alt=media&token=d9995372-e3a2-44d8-89af-81530863f9a2', 
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext2.png?alt=media&token=1ba53d18-3749-4ee0-8207-2c52468e2a6d',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext3.png?alt=media&token=72fcf351-5e93-4ff5-8afe-ccc5bce1fd1d',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext5.png?alt=media&token=a6789709-6744-49dc-958e-030f53e201b6',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext6.png?alt=media&token=c4ef2ab3-e713-4c9c-b863-5555c5f52d3d',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext7.png?alt=media&token=3d357dc1-e0e2-46e1-bb3b-fe544970c7c0',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext8.png?alt=media&token=f3f97484-2935-4757-8fbd-d026ee4a932d',
  'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext5.png?alt=media&token=80f78d2c-4914-41af-a56a-42f4ed69ccd8']
  const randomIndex =  Math.floor(Math.random() * 8);
  return (imgUrls[randomIndex])
}
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
              console.log(imageUrl)
              let imageUrlQuickCopy = imageUrl
              if (imageUrlQuickCopy == "") {
                const randomImage = addRandomImageUrl()
                setImageUrl(randomImage)
                imageUrlQuickCopy = randomImage
              }
              let museum = await MuseumAPI.addMuseum(name, description, isPrivate, imageUrlQuickCopy);
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
