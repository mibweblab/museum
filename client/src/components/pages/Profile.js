import React from "react";
import { Button } from "semantic-ui-react";
import {Link} from "@reach/router"
import {Card} from "react-bootstrap"
import './Profile.scss';
import './Card.css';
import ModalViewer from "../modules/ModalViewer"
import { useModal } from "react-hooks-use-modal";



const UserProfile = ({user, museumCount, editUser}) => {
  const [Modal, open, close, isOpen] = useModal("root", {
      preventScroll: true,
      closeOnOverlayClick: false,
    });
  
  return(
  <div className="d-flex ">
     <ModalViewer Modal={Modal} open={open} close={close} isOpen={isOpen} modalType="user" user={user} editUser={editUser}/>
    <div className="cardy ">
        <div className="d-flex align-items-center">
            <div className="Profile-image Profile-shadow"> <img src={user.imageUrl} className="rounded" width="155"/> </div>
            <div className="ml-3 w-100 Profile-content">
                <h4 className="mb-0 mt-0">
                  {user.firstname} {user.lastname} 
                  <label className="u-link" onClick={open} >
                   <tab/> Edit         
                  </label>
                </h4> <span>{user.description}</span>
                <div className="here d-flex justify-content-center rounded text-white stats">
                    <div className="d-flex flex-column"> <span className="articles">Museums</span> <span className="number1">{museumCount}</span> </div>

                </div>
                {/* <div className="button mt-2 d-flex flex-row align-items-center"> <button className="btn btn-sm btn-outline-primary w-100">Chat</button> <button className="btn btn-sm btn-primary w-100 ml-2">Follow</button> </div> */}
            </div>
        </div>
    </div>
</div>)
}
const MuseumCard = ({ imageUrl, name, description, _id, isPrivate, userImageUrl }) => {

  return (
    <>
      <div className="card Profile-shadow" to={`/museum/`+ _id }>
      <Button id="card__button_cta" >Edit </Button><Button id="card__button" >Visit</Button>
        <img src={imageUrl} className="card__image"/>
          <div className="card__overlay">
            <div className="card__header">
              <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
              <img className="card__thumb" src={userImageUrl} alt="" />
              <div className="card__header-text">
                <h3 className="card__title">{name}</h3>            
              <span className="card__status">1 hour ago</span><br/>
              <span className="card__status">{(isPrivate) ? "Private" : "Public"}</span>
            </div>
          </div>
      </div>
      
      </div>
      
    </>
    

  )



}
const Profile = ({museums, user, editUser}) => {

  return (
    
    <div className="Profile">
      <div className="Profile-user">
        <UserProfile user={user} museumCount={museums.length} editUser={editUser}/>
      </div>
      <div className="Profile-museums cards">
        {museums.map(
          (props,index) => <MuseumCard key={props._id} {...props} userImageUrl = {user.imageUrl}/> /* prettier-ignore */
        )}
      </div>
    </div>
  );
};

export { Profile, MuseumCard} ;
