import React, { Component, useEffect , useState} from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get } from "../../../utilities";
import "./Navbar.css";
import { Button } from "semantic-ui-react";
import { useModal } from "react-hooks-use-modal";
import ModalViewer from "../ModalViewer"
import {  useLocation } from 'wouter'
// This identifies your web application to Google's authentication service
// const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID = "486452721555-mv97gl89cqbdemntlnbugl44c72iphuv.apps.googleusercontent.com";
// 486452721555-mv97gl89cqbdemntlnbugl44c72iphuv.apps.googleusercontent.com

const NavBar = (props) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useLocation();
  useEffect(() => {
    if (props.userId) {
      get(`/api/user`, { userid: props.userId }).then((user) => {
        setName(user.name);
      });
    }
  }, [props.userId]);

  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const callback = () => {
    setLocation('./profile');
  }
  return (
    <nav className="NavBar-container">
      <ModalViewer Modal={Modal} open={open} close={close} isOpen={isOpen} modalType="museum" />
      {(location != '/' && (props.userId == undefined)) && (<div className="NavBar-title u-inlineBlock Navbar-item">
        <Link to="/" className="u-link">Wander</Link>
      </div>)} 
      <div className="NavBar-title u-inlineBlock Navbar-item">
        {(props.userId && location != '/profile') && <Link to="/profile" className="u-link">My Wander</Link> }
      </div>
      <div className="NavBar-title u-inlineBlock Navbar-item">
        {(props.userId) &&  <label className="u-link"  onClick={open}>
          +Create Museum
        </label>}
      </div>
        <div className="NavBar-title u-inlineBlock Navbar-item">
          <Link to="/explore" className="u-link">Explore</Link>
        </div>
        <div className="NavBar-title u-inlineBlock Navbar-item">
        {props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={props.handleLogout}
            onFailure={(err) => console.log(err)}
            className="NavBar-link NavBar-login Navbar-item"
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={(res) => props.handleLogin(res, callback)}
            onFailure={(err) => console.log(err)}
            className="NavBar-link NavBar-login Navbar-item"
          />
        )}
      </div>
    </nav>
  );
};

// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "",
//     };
//   }

//   componentDidMount() {
//     document.title = "Profile Page";
//     if (this.props.userId) {
//       get(`/api/user`, { userid: this.props.userId }).then((user) => {
//         this.setState({ name: user.name });
//       });
//     }
//   }
//   componentDidUpdate() {
//     document.title = "Profile Page";
//     if (this.props.userId) {
//       get(`/api/user`, { userid: this.props.userId }).then((user) => {
//         this.setState({ name: user.name });
//       });
//     }
//   }

//   render() {
//     const [Modal, open, close, isOpen] = useModal("root", {
//       preventScroll: true,
//       closeOnOverlayClick: false,
//     });

//     return (
//       <nav className="NavBar-container">
//         <ModalViewer
//           Modal={Modal}
//           open={open}
//           close={close}
//           isOpen={isOpen}
//           modalType="museum"
//         />
//         <div className="NavBar-title u-inlineBlock">Museum</div>
//         <div className="NavBar-linkContainer u-inlineBlock">
//           <Button color="blue" onClick={open}>
//             Create Museum
//           </Button>

//           {/* <Link to="/" className="NavBar-link"></Link>
//           {this.props.userId && (<Link to="/shakespeare/" className="NavBar-link">
//             Shakespeare
//           </Link>)}
//           {this.props.userId && (<Link to="/einstein/" className="NavBar-link">
//             Einstein
//           </Link>)}
//           {this.props.userId && (<Link to="/musk/" className="NavBar-link">
//             Musk
//           </Link>)} */}

//           {this.props.userId ? (
//             <GoogleLogout
//               clientId={GOOGLE_CLIENT_ID}
//               buttonText="Logout"
//               onLogoutSuccess={this.props.handleLogout}
//               onFailure={(err) => console.log(err)}
//               className="NavBar-link NavBar-login"
//             />
//           ) : (
//             <GoogleLogin
//               clientId={GOOGLE_CLIENT_ID}
//               buttonText="Login"
//               onSuccess={this.props.handleLogin}
//               onFailure={(err) => console.log(err)}
//               className="NavBar-link NavBar-login"
//             />
//           )}
//         </div>
//       </nav>
//     );
//   }
// }

export default NavBar;
