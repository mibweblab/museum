import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
// import NavBar from "./modules/Navbar/Navbar.js";
import Conversation from "./Conversations/Conversation.js";
// import { Suspense } from "react";
import NavBar from "./modules/Navbar/Navbar.js";
import Rooms from "./Conversations/Rooms.js";
import GPT3_playground from "./pages/GPT3_playground.js";
import { Shakespeare, Einstein, Musk, UserUpload } from "../HumanModel";

import World from "../components/modules/World";
// import GPT3_playground from "./pages/GPT3_playground.js";
// import { Shakespeare, Einstein, Musk } from "../LangModel.js";
import { Suspense } from "react";
import FrameWorld from "./modules/FrameWorld.js";
import { connect } from "react-redux";

import "../utilities.css";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";
import "./App.scss";

import { useLocation, Switch, Route } from "wouter";
import APIInterface from "../api/api.js";
import MuseumInterface from "../api/museum";
import {Profile} from "./pages/Profile";
import Explore from "./pages/Explore";
import Landing from "./pages/Landing";
import UserApi from "../api/user";

import { addInitialFrames, addInitialMuseums } from "./action";



const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
    museums: state.museums,
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      firstName: "",
      museums: [],
    };
  }

  async getAllMuseums() {
    let allMuseums = await MuseumInterface.getAllMuseums();
    if (allMuseums) {
      console.log("these are my museums", allMuseums);
      this.setState({ museums: allMuseums.data });
      this.props.dispatch(addInitialMuseums(allMuseums.data));
    }
  }

  async componentDidMount() {
    get("/api/whoami").then(async (user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ user: user, firstName: user.firstname });
        await this.getAllMuseums();
      }
    });
  }


  handleLogin = (res, callback) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then(async (user) => {
      this.setState({ 
        user: user, 
        firstName: user.firstname
      });

      await this.getAllMuseums();
      post("/api/initsocket", { socketid: socket.id });
      callback()
    });
  };

  handleLogout = () => {
    // setUserId(undefined);
    this.setState({ user: null, firstName:null });
    post("/api/logout");
  };

  editUserFunction = async(data) => {
    let userEdited = await UserApi.updateUser(this.state.user._id, data);
    this.setState({ 
      user: data, 
      firstName: data.firstname
  });

}


  render() {
    return (
      <>
        <NavBar
          handleLogin={this.handleLogin.bind(this)}
          handleLogout={this.handleLogout.bind(this)}
          userId={(this.state.user) ? this.state.user._id : null}
        />
        <Route path="/">
          <Landing />
        </Route>

        <Route path="/profile">
          {this.state.user && <Profile museums={this.props.museums} currentUserProfile={this.state.user} editUserFunction={this.editUserFunction}/>}

          {!this.state.user && <div>Sign In to View</div>}
        </Route>
        <Route path="/profile/:id">
          { ((params) => (<Profile museums={this.props.museums} otherUserProfileId={params.id} editUserFunction={this.editUserFunction}/>))}
        </Route>
        <Route exact path="/museum/:id">
          {this.state.user && ((params) => <FrameWorld id={params.id} />)}
        </Route>
        <Route exact path="/museum">
         <Landing />
        </Route>

        <Route path="/room_0">
          <Rooms FirstName={this.state.firstName} HumanModel={Shakespeare} />
        </Route>
        <Route path="/room_1">
          <Rooms  FirstName={this.state.firstname} HumanModel={Einstein} />
        </Route>

        <Route path="/room_2">
          <Rooms FirstName={this.state.firstname} HumanModel={Musk} />
        </Route>
        <Route path="/room_user_upload">
        {this.state.user && <Rooms FirstName={this.state.firstname} HumanModel={UserUpload} />}
        </Route>
        <Route exact path="/room/:id">
          {this.state.user && ((params) => <Rooms FirstName={this.state.firstname} HumanModel={UserUpload} FrameId={params.id} />)}
        </Route>
        <Route exact path="/explore">
          <Explore currentUserId={(this.state.user) ? (this.state.user._id) : (undefined) } />
        </Route>
        {/* {this.props.frames && <FrameWorld images={this.props.frames} />} */}
        {/* <Route path="/scene/:id">{<World />}</Route> */}
      </>
    );
  }
}





export default connect(mapStateToProps)(App);
