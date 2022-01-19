import React, { useState } from "react";
import { render } from "react-dom";
import { storage } from "../firebase/firebase";

const ImageUpload = () => {
  //image input
  const [image, setImage] = useState(null); //  image state
  const [url, setUrl] = useState("");
  //show progress bar
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      // if there's a file then update the state with that file
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    // how we add on firebase and create a folder name images
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_change",
      //indicate current progress
      (snapshot) => {
        // here we do the progress calculation
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(snapshot);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            // set the new url of image
            setUrl(url);
          });
      }
    );
  };

  //check image
  console.log("image: ", image);

  return (
    <div>
      <br />
      <h1> Image Upload</h1>
      <br />
      <form>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Upload</button>
      </form>
      <progress value={progress} max="100" />
      <br></br>
      <img src={url || "http:/via.placeholder.com/300"} alt="firebase-image" />
    </div>
  );
};

export default ImageUpload;
