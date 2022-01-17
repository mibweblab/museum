import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get } from "../../../utilities"
import "./NavBar.css";


// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }
  
  componentDidMount() {
    document.title = "Profile Page";
    if (this.props.userId) {
      get(`/api/user`, { userid: this.props.userId }).then((user) => 
      {
        this.setState({ name: user.name });
      })
      
    }
  }
  componentDidUpdate() {
    document.title = "Profile Page";
    if (this.props.userId) {
      get(`/api/user`, { userid: this.props.userId }).then((user) => 
      {
        this.setState({ name: user.name });
      })
    }
  }

  render() {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock">Museum</div>
        <div className="NavBar-linkContainer u-inlineBlock">
            <Link to="/" className="NavBar-link"></Link>
          {this.props.userId && (
          <>
            <Link to="/shakespeare/" className="NavBar-link">
              Shakespeare
            </Link>
            <Link to="/einstein/" className="NavBar-link">
              Einstein
            </Link>
            <Link to="/musk/" className="NavBar-link">
              Musk
            </Link>
            <Link to="/room_shakespeare/" className="NavBar-link">
              Shakespeare Scene
            </Link>
            <Link to="/room_einstein/" className="NavBar-link" trial='0'>
              Einstein Scene 0
            </Link>       
            <Link to="/room_einstein/" className="NavBar-link" trial='1'>
              Einstein Scene 1
            </Link>           
          </>)}

          
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
