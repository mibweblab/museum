import React, { useState, useEffect, Suspense } from "react";
import { Button } from "semantic-ui-react";
import { Link } from "@reach/router";
import { Card } from "react-bootstrap";
import "./Profile.scss";
import Gallery from "../modules/Landing/Gallery";
import GallerySeconadry from "../modules/Landing/GallerySecondary";
// import "./Landing.css";
import "./Landing.scss";
import Wander from "../modules/Landing/Wander";
import { Loader } from "@react-three/drei";

const Landing = ({}) => {
  const imgUrls = [
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice1.jpg?alt=media&token=bc6c6511-cc7c-4185-a582-376e945684bc",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice2.jpg?alt=media&token=5999f320-9c1a-4de2-8f8e-254d2dc3710f",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice3.jpg?alt=media&token=fc75d1db-787e-4537-8e2c-f60eb0e161fc",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice4.jpg?alt=media&token=8e3bbf54-2246-41ac-8df0-3cbc1b1523f4",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice5.jpg?alt=media&token=5d967faa-522c-4a85-88ad-4657cca75b5c",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice6.jpg?alt=media&token=f5be6fa1-b3f0-4353-ab18-9851e2d288ac",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice7.jpg?alt=media&token=d3d68dad-e4a7-4264-bce3-68c46bcff28f",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice8.jpg?alt=media&token=34e695b8-2acc-48d2-918d-48e2784395d0",
    "https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Fnice9.jpg?alt=media&token=c2ff517d-6d80-44a5-a116-0bbca4a734fa",
  ];
  const images = [
    // Front
    { position: [0, 0, 1.5], rotation: [0, 0, 0], url: imgUrls[0] },
    // Back
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: imgUrls[1] },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: imgUrls[2] },
    // Left
    { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: imgUrls[3] },
    { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: imgUrls[4] },
    { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: imgUrls[5] },
    // Right
    { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: imgUrls[6] },
    { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: imgUrls[7] },
    { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: imgUrls[8] },
  ];
  const [child1Ready, setReady] = useState(false);

  const [className, setClassName] = useState("Landing-subtitle");
  const [landingTextClassName, setLandingTextClassName] = useState("Landing-text");

  const [secondClassName, setSecondClassName] = useState("Landing-subtitle");
  const [landingTextSecondClassName, setLandingTextSecondClassName] = useState("Landing-text");

  useEffect(() => {
    const onScroll = (e) => {
      if (window.scrollY > 0.5 * window.innerHeight) {
        setClassName("Landing-subtitle--large");
        setLandingTextClassName("Landing-text--large");
      }else{
        setClassName("Landing-subtitle");
        setLandingTextClassName("Landing-text");
      }

      if (window.scrollY > 1.3 * window.innerHeight) {
        setSecondClassName("Landing-subtitle--large2");
        setLandingTextSecondClassName("Landing-text--large");
      } else {
        setSecondClassName("Landing-subtitle");
        setLandingTextSecondClassName("Landing-text");
      }
    };
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <>
          <Wander className="Landing-wander" />
          <div className="Landing-container">
            <div className="Landing-titleWrapper">
              <span className={className}>Build your own museums. </span>
              <span className={landingTextClassName}>
                {" "}
                Construct rooms, craft galleries, and share your work.
              </span>
            </div>
          </div>
          <Gallery images={images} />
          <div className="Landing-container">
            <div className="Landing-titleWrapper">
              <span className={secondClassName}>Conversations</span>
              <span className={landingTextSecondClassName}>
                Taken from our favorite films, enter conversation rooms and chat with prominent figures
              </span>
            </div>
          </div>
          <div className='Landing-flex'>
            <img className='Landing-gif Landing-gifleft' src={'/hpotter/gif1.gif'} alt="loading..." />
            <img className='Landing-logo Landing-giflogo' src={'/hpotter/logo.jpeg'} alt="loading..." />
            <img className='Landing-gif Landing-gifright' src={'/hpotter/gif2.gif'} alt="loading..." />
          </div>

          <GallerySeconadry />
        </>
      </Suspense>
      <Loader
        initialState={(active) => true}
        cbarStyles={{ backgroundColor: "black", color: "red" }} // Loading-bar styles
        dataStyles={{ backgroundColor: "white", color: "black" }}
        containerStyles={{ backgroundColor: "white", color: "white" }}
      />
    </>
  );
};

export default Landing;
