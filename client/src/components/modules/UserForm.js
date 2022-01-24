import React, { Suspense, useEffect, useRef, useState } from "react";
import "./UserForm.scss";
import { Input, Button, Dropdown, TextArea } from "semantic-ui-react";
import { storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { connect } from "react-redux";
import { addMuseum } from "../action";



// const mapStateToProps = (state) => {
//   return {
// frames: state.frames,
// queuedFrame: state.queuedFrame,
// isThereQueuedFrame: state.isThereQueuedFrame,
// museums: state.museums
//   };
// };

const UserForm = ({ dispatch, user, close, editUser }) => {
  const [firstname, setfirstname] = useState(user.firstname);
  const [lastname, setlastname] = useState(user.lastname);
  const [description, setDescription] = useState(user.description);
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const [didUpdateContent, setDidUpdateContent] = useState(false)

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
  console.log('HI')
  console.log(editUser)
  return (
    <div className="MuseumForm">
      <div className="MuseumForm-row-group">
        <Input onChange={(_, data) => setfirstname(data.value)} placeholder="Name" className={"MuseumForm-item"} value={firstname}/>
        <Input onChange={(_, data) => setlastname(data.value)} placeholder="Name" className={"MuseumForm-item"} value={lastname}/>
      </div>
      <div className="MuseumForm-group">
        <TextArea
          onChange={(_, data) => setDescription(data.value)}
          placeholder="Tell us more"
          style={{ minHeight: "30px",  border: "1px solid rgba(34, 36, 38, 0.15)" }}
          value={description}
          className={"flex-grow-1"}
        />
      </div>
      <div className="MuseumForm-group">
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>Upload New Profile Image</Button>
      </div>
      <div className="MuseumForm-col-group">
        <Button className={"w-30 MuseumForm-action-btn "}
          onClick={() =>
            {
              const googleid = user.googleid
              const data = {
                firstname, 
                lastname, 
                googleid, 
                imageUrl, 
                description
              }
              editUser(data)
            }
          }
        >
          Update
        </Button>
        <Button className={"w-30"}
          onClick={close}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default connect()(UserForm);
