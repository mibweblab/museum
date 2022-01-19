import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
import ImageUpload from "../components/pages/imageUpload";

import GPT3_playground from "./pages/GPT3_playground.js";
import { Shakespeare, Einstein, Musk } from "../LangModel.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
// import Speech from "./pages/Speech.js"; //Haven't used yet

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [firstName, setFirstName] = useState(undefined);

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
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
      <Router>
        <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <GPT3_playground path="/shakespeare/" FirstName={firstName} HumanModel={Shakespeare} />
        <GPT3_playground path="/einstein/" FirstName={firstName} HumanModel={Einstein} />
        <GPT3_playground path="/musk/" FirstName={firstName} HumanModel={Musk} />
        <ImageUpload path="/image" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
