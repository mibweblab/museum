import React, { Suspense, useEffect, useRef, useState } from "react";
import "./MuseumForm.scss";
import { Input, Button, Dropdown, TextArea } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { connect } from "react-redux";
import { addMuseum } from "../action";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';

import MuseumAPI from "../../api/museum";

import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const addRandomImageUrl = () => {
  const imgUrls = [
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext1.png?alt=media&token=d9995372-e3a2-44d8-89af-81530863f9a2",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext2.png?alt=media&token=1ba53d18-3749-4ee0-8207-2c52468e2a6d",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext3.png?alt=media&token=72fcf351-5e93-4ff5-8afe-ccc5bce1fd1d",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext5.png?alt=media&token=a6789709-6744-49dc-958e-030f53e201b6",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext6.png?alt=media&token=c4ef2ab3-e713-4c9c-b863-5555c5f52d3d",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext7.png?alt=media&token=3d357dc1-e0e2-46e1-bb3b-fe544970c7c0",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext8.png?alt=media&token=f3f97484-2935-4757-8fbd-d026ee4a932d",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext5.png?alt=media&token=80f78d2c-4914-41af-a56a-42f4ed69ccd8",
  ];
  const randomIndex = Math.floor(Math.random() * 8);
  return imgUrls[randomIndex];
};
const MuseumForm = ({ dispatch, close}) => {

  const textRef = useRef();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [nameCharacterLength, setCharacterLength] = useState(0);
  const [descriptionCharacterLength, setDescriptionCharacterLength] = useState(0);
  const [isNameError, setNameError] = useState(false);
  const [isDescriptionError, setDescriptionError] = useState(false);
  const [snackBarColor, setSnackBarColor] = useState(false);

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
          setIsImageUploaded(true);
        });
      })
      .catch(() => {
        setIsImageUploaded(false)
      });
  };

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div className="MuseumForm">
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <div className="MuseumForm-title">Edit Museum</div>
      <div className="MuseumForm-group">
        <TextField
          error={isNameError}
          onChange={(e) => {
            if (e.target.value.length<=40){
              setName(e.target.value);
              setCharacterLength(e.target.value.length);
              setNameError(false)
            } else{
              setNameError(true)
            } 
          }}
          fullWidth
          sx={{height: 20}}
          id="fullWidth"
          label="Name"
          variant="standard"
          className="Museum-textField"
          helperText={nameCharacterLength + " / 40"}
        />
      </div>
      <div className="MuseumForm-group">
        <TextField
          error={isDescriptionError}
          id="standard-multiline-static"
          label="Description"
          multiline
          rows={4}
          fullWidth
          placeholder="Tell us more"
          variant="standard"
          className="Card-field"
          helperText={descriptionCharacterLength + " /400"}
          onChange={(e) => {
            if (e.target.value.length<=400){
              setDescription(e.target.value)
              setDescriptionCharacterLength(e.target.value.length);
              setDescriptionError(false)
            } else{
              setDescriptionError(true)
            } 
          }}
          inputRef={textRef}
        />
      </div>
      <div className="MuseumForm-row-group">
        <Dropdown
          onChange={(_, data) => setPrivate(data.value)}
          search
          selection
          placeholder="Privacy"
          options={options}
          className={"MuseumForm-item"}
        />
      </div>
      <div className="MuseumForm-group">
        <input type="file" className="MuseumForm-inputFile" onChange={handleChange} />
        <button className="MuseumForm-uploadButton" onClick={handleUpload}>
          Image
          <img className="MuseumForm-uploadImage"src="https://img.icons8.com/external-bearicons-blue-bearicons/64/000000/external-upload-call-to-action-bearicons-blue-bearicons.png"/>
        </button>
      </div>
      <div className="MuseumForm-col-group MuseumForm-group">
        <Button
          className={"w-30 MuseumForm-action-btn "}
          onClick={async () => {
            if (name && description) {
              console.log(imageUrl);
              let imageUrlQuickCopy = imageUrl;
              if (imageUrlQuickCopy == "") {
                const randomImage = addRandomImageUrl();
                setImageUrl(randomImage);
                imageUrlQuickCopy = randomImage;
              }
              let museum = await MuseumAPI.addMuseum(
                name,
                description,
                isPrivate,
                imageUrlQuickCopy
              );
              if (museum) {
                dispatch(addMuseum(museum.data));
              }
            }
            close();
          }}
        >
          Edit
        </Button>
        <Button className={"w-30"} onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default connect()(MuseumForm);
