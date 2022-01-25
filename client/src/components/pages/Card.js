import React, {useState, useEffect} from "react";
import { Button } from "semantic-ui-react";
import './Profile.scss';
import './Card.css';


const MuseumCard = ({  imageUrl, name, description, _id, isPrivate, userImageUrl, userObject, navigate, isCurrentUser }) => {
    return (
      <>
        <div className="card Profile-shadow">
          {(isCurrentUser) && <Button id="card__button_cta" onClick={() => navigate(`/museum/`+ _id)}>Edit </Button>}
          <Button id="card__button" >Visit</Button>
          <img src={imageUrl} className="card__image"/>
            <div className="card__overlay">
              <div className="card__header">
                <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
                <img className="card__thumb" src={userObject.imageUrl} alt="" onClick={
                  () => { 
                    if (isCurrentUser) {
                      navigate(`/profile/`)
                    } else {
                      navigate(`/profile/`+ userObject._id)
                    }
                  }}
                  />
                <div className="card__header-text">
                  <h3 className="card__title">{name}</h3>            
                <span className="card__status">1 hour ago</span><br/>
                {isPrivate && <span className="card__status">Private</span>}
              </div>
            </div>
            <p class="card__description">{description}</p>
        </div>
        </div>
      </>
    )
  }

  export { MuseumCard } ;
