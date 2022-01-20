import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/Navbar/Navbar.js";

import World from "../components/modules/World";
import GPT3_playground from "./pages/GPT3_playground.js";
import { Shakespeare, Einstein, Musk } from "../LangModel.js";
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
import Profile from "./pages/Profile";

import { addInitialFrames, addInitialMuseums } from "./action";

import Landing from "../components/modules/Landing";

const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
    museums: state.museums
  };
};

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          userId: null,
          firstName: null,
          museums: []
        }
     
    }

    async getAllMuseums() {
      let allMuseums= await MuseumInterface.getAllMuseums();
      if (allMuseums) {
        console.log("these are my museums", allMuseums);
        this.setState({museums: allMuseums.data})
        this.props.dispatch(addInitialMuseums(allMuseums.data));
      }
    }

    async componentDidMount(){

      get("/api/whoami").then(async (user) => {
        if (user._id) {
          // they are registed in the database, and currently logged in.
          this.setState({userId: user._id})
          // setUserId(user._id);
          this.setState({firstName: user.firstname})
          await this.getAllMuseums();
        }
      });

    }

     handleLogin = (res) => {
      console.log(`Logged in as ${res.profileObj.name}`);
      const userToken = res.tokenObj.id_token;
      post("/api/login", { token: userToken }).then(async (user) => {

        this.setState({userId: user._id})
        // setUserId(user._id);
        this.setState({firstName: user.firstname})
        // setFirstName(user.firstname);
        await this.getAllMuseums();
        post("/api/initsocket", { socketid: socket.id });
      });
    };
  
     handleLogout = () => {
      // setUserId(undefined);
      this.setState({userId:null})
      post("/api/logout");
    };

    render(){
      return (
      <>
      <NavBar handleLogin={this.handleLogin.bind(this)} handleLogout={this.handleLogout.bind(this)} userId={this.state.userId} />
      <Route path="/">
        {
          this.state.userId &&
          <Profile museums={this.props.museums} />
        }
        
        {
          !this.state.userId &&
          <div>Sign In to View</div>
        }
      </Route>

      <Route exact path="/museum/:id">
          { this.state.userId &&
          (params => <FrameWorld id={params.id}/>)
    }
      </Route>
        {/* {this.props.frames && <FrameWorld images={this.props.frames} />} */}
        {/* <Route path="/scene/:id">{<World />}</Route> */}
    </>    
      )
    }
}


// /**
//  * Define the "App" component
//  */
// const App = ({ frames, dispatch }) => {
//   const [userId, setUserId] = useState(undefined);
//   const [this.state.firstName, setFirstName] = useState(undefined);

//   console.log("frames changes", frames)

//   async function getAllFrames() {
//     let allFrames = await APIInterface.getAllFrames();
//     if (allFrames) {
//       console.log("these are my frames", allFrames);
//       dispatch(addInitialFrames(allFrames.data));
//     }
//   }

//   useEffect(() => {
//     get("/api/whoami").then((user) => {
//       if (user._id) {
//         // they are registed in the database, and currently logged in.
//         setUserId(user._id);
//         setFirstName(user.firstname);
//         getAllFrames();
//       }
//     });

//     getAllFrames();
//   }, []);

//   const handleLogin = (res) => {
//     console.log(`Logged in as ${res.profileObj.name}`);
//     const userToken = res.tokenObj.id_token;
//     post("/api/login", { token: userToken }).then((user) => {
//       setUserId(user._id);
//       setFirstName(user.firstname);
//       getAllFrames();
//       post("/api/initsocket", { socketid: socket.id });
//     });
//   };

//   const handleLogout = () => {
//     setUserId(undefined);
//     post("/api/logout");
//   };

//   return (
//     <>
//       <Route path="/">
//         <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
//         {frames && <FrameWorld images={frames} />}
//       </Route>
//       {/* <Route path="/scene/:id">{<World />}</Route> */}
//     </>
//   );
// };

export default connect(mapStateToProps)(App);
