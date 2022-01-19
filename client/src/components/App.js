import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import  Conversation  from './pages/Conversation.js'
import { Suspense } from "react";
import NavBar from "./modules/Navbar/Navbar.js";
import Rooms from "./pages/Rooms.js"; 
import GPT3_playground from "./pages/GPT3_playground.js";
import { Shakespeare, Einstein, Musk, UserUpload } from '../HumanModel';

import FrameWorld from "./modules/FrameWorld";
import { connect } from "react-redux";

import "../utilities.css";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";
import "./App.scss";

import { useLocation, Switch, Route } from "wouter";
import APIInterface from "../api.js";
import { addInitialFrames } from "./action";
import World from "./modules/World";

const mapStateToProps = (state) => {
  return {
    frames: state.frames,
    queuedFrame: state.queuedFrame,
    isThereQueuedFrame: state.isThereQueuedFrame,
  };
};

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          userId: null,
          firstName: null,
        }
     
    }

    async getAllFrames() {
      let allFrames = await APIInterface.getAllFrames();
      if (allFrames) {
        console.log("these are my frames", allFrames);
        this.props.dispatch(addInitialFrames(allFrames.data));
      }
    }

    async componentDidMount(){

      get("/api/whoami").then(async (user) => {
        if (user._id) {
          // they are registed in the database, and currently logged in.
          this.setState({userId: user._id})
          // setUserId(user._id);
          this.setState({firstName: user.firstname})
          await this.getAllFrames();
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
        await this.getAllFrames();
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
        
          <NavBar handleLogin={this.handleLogin.bind(this)} handleLogout={this.handleLogout.bind(this)} userId={this.state.userId}/>

          {/* <Route path="/">
            {frames && <FrameWorld images={frames} />}
          </Route> 
          <Route path="/scene/:id">{<World />}</Route>   
          {this.state.firstName &&
            <Route path="/room/:id">{<Rooms FirstName={this.state.firstName} />}</Route> 
          } */}
          {/* <div id='content'> */}
          <Router className='content'>
            {/* <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            <GPT3_playground path="/shakespeare/" FirstName={this.state.firstName} HumanModel={Shakespeare}/> 
            <GPT3_playground path="/einstein/" FirstName={this.state.firstName} HumanModel={Einstein}/> 
            <GPT3_playground path="/musk/" FirstName={this.state.firstName} HumanModel={Musk}/>  */}
            <Conversation path='/c' HumanModel={Shakespeare}/>
            <Rooms path="/room_shakespeare/" FirstName={this.state.firstName} HumanModel={Shakespeare}/> 
            <Rooms path="/room_einstein/" FirstName={this.state.firstName} HumanModel={Einstein}/> 
            <Rooms path="/room_musk/" FirstName={this.state.firstName} HumanModel={Musk}/> 
            <Rooms path="/room_user_upload/" FirstName={this.state.firstName} HumanModel={UserUpload}/> 
            <NotFound default />
          </Router>
          {/* </div> */}
        </>
      );
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
