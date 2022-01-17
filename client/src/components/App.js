import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";

import World from "../components/modules/World";

import GPT3_playground from "./pages/GPT3_playground.js";
import { Shakespeare, Einstein, Musk } from "../LangModel.js";
import { Suspense } from "react";

import FrameWorld from "./modules/FrameWorld.js";
import { connect } from "react-redux";

import { useModal } from "react-hooks-use-modal";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import "./App.scss";

import { useLocation, Switch, Route } from "wouter"

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
  };
};

const images = [
  // Front
  { url: pexel(1103970) },
  // Back
  // { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  // { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // // Left
  // { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  // { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  // { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574) },
  // // Right
  // { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675) },
  // { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  // { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) }
];

/**
 * Define the "App" component
 */
const App = (props) => {
  const [userId, setUserId] = useState(undefined);
  const [firstName, setFirstName] = useState(undefined);
  // console.log("these are my props", props);
  // const [Modal, open, close, isOpen] = useModal("root", {
  //   preventScroll: true,
  //   closeOnOverlayClick: false,
  // });
  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setFirstName(user.firstname);
      }
    });


    
  }, []);

  const handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setFirstName(user.firstname);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      {/* <World /> */}
      {/* <div className="btn"> 
        <p>Modal is Open? {isOpen ? "Yes" : "No"}</p>
        <button onClick={open}>OPEN</button>
      </div> */}

      <Route path="/">
        <FrameWorld images={props.frames} />
      </Route>
      <Route path="/scene/world">
        <World />
      </Route>
      {/* <Route>
        <FrameWorld images={props.frames} />
      </Route> */}
      {/* <Modal>
        <div className="hello">
          <h1>Title</h1>
          <p>This is a customizable modal.</p>
          <button onClick={close}>CLOSE</button>
        </div>
      </Modal> */}
    </>
  );
};

export default connect(mapStateToProps)(App);
