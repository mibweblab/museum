import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import "./Profile.scss";
import "./Card.css";
import "./Card.scss";

const MuseumCard = ({
  imageUrl,
  name,
  description,
  _id,
  isPrivate,
  userImageUrl,
  userObject,
  navigate,
  isCurrentUser,
}) => {


  let placeHolderUrl = 'https://firebasestorage.googleapis.com/v0/b/weblab-338617.appspot.com/o/images%2Ftext1.png?alt=media&token=d9995372-e3a2-44d8-89af-81530863f9a2';
  let thumbPlaceHolder = "https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-user-essentials-icongeek26-linear-colour-icongeek26.png";

  // <a href="https://icons8.com/icon/a3ZTtCK3M7GR/user">User icon by Icons8</a>
  // <img src="https://img.icons8.com/ios/50/000000/visible--v1.png"/>
  // <a href="https://icons8.com/icon/986/eye">Eye icon by Icons8</a>
  // <img src="https://img.icons8.com/ios/50/000000/private-lock.png"/>

  // <a href="https://icons8.com/icon/99971/delete">Delete icon by Icons8</a>

  // <a href="https://icons8.com/icon/-JWlW8fnBxDo/private-lock">Private Lock icon by Icons8</a>
  // <img src="https://img.icons8.com/material-sharp/24/000000/filled-trash.png"/>

  // <a href="https://icons8.com/icon/99971/delete">Delete icon by Icons8</a>

  // <img src="https://img.icons8.com/plasticine/100/000000/edit.png"/>

  // <a href="https://icons8.com/icon/102333/edit">Edit icon by Icons8</a>

  // <img src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-edit-interface-kiranshastry-lineal-kiranshastry-1.png"/>
 
  //<a href="https://icons8.com/icon/y2QbtBP7og0m/edit">Edit icon by Icons8</a>

  // <img src="https://img.icons8.com/cute-clipart/64/000000/enter-2.png"/>


  // <a href="https://icons8.com/icon/119065/enter">Enter icon by Icons8</a>



  return (
    <>
      <div className="Card">
        {/* {(isCurrentUser) && <Button id="card__button_cta" onClick={() => navigate(`/museum/`+ _id)}>Edit </Button>}
        <Button id="card__button" >Visit</Button> */}
{/* <img src="https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-user-essentials-icongeek26-linear-colour-icongeek26.png"/> */}

        <div className="Card-header">
          <img src={imageUrl ? imageUrl : placeHolderUrl} className="Card-image" />
        </div>
        <div className="Card-body">
          <div className="Card-details">
            <div className="Card-titleWrapper">
              <img
                  className="Card-thumb"
                  src={userObject.imageUrl ?  userObject.imageUrl : thumbPlaceHolder}
                  alt=""
                  onClick={() => {
                    if (isCurrentUser) {
                      navigate(`/profile/`);
                    } else {
                      navigate(`/profile/` + userObject._id);
                    }
                  }}
                />  
              <span className="Card-title">
                {name}
              </span>        
            </div>
            {/* <span className="Card-time">1 hour ago</span> */}
          </div>

          <div className="Card-descriptionWrapper">
            <span class="Card-description">{description}</span>
          </div>
      
          <div className="Card-icons">
            {isPrivate && 
            <span className="Card-status">
              <img
              src="https://img.icons8.com/ios/50/000000/visible--v1.png"
              className="Card-statusImage"
              />
              </span>
            }{
              !isPrivate && 
              <span className="Card-statusPrivate">
                <img
                src="https://img.icons8.com/ios/50/000000/private-lock.png"
                className="Card-statusImage"
                />
                </span>
            } 
            {  (isCurrentUser) && 
            <div className="Card-delete" >
              <img src="https://img.icons8.com/material-sharp/24/000000/filled-trash.png"
                className="Card-statusImage"
                />
            </div>  
              }
            {(isCurrentUser) &&<div className="Card-edit" onClick={()=>{navigate(`/museum/edit/`+ _id)}}>
              <img src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-edit-interface-kiranshastry-lineal-kiranshastry-1.png"
                className="Card-editImage"
                />
            </div> 
            }
            <div className="Card-enter" onClick={()=>{navigate(`/museum/view/`+ _id)}}>
              <img src="https://img.icons8.com/plasticine/100/000000/login-rounded.png"
                className="Card-enterImage"
                />
            </div>     
          </div>

        </div>
      </div>
    </>
  );
};

// const MuseumCard = ({  imageUrl, name, description, _id, isPrivate, userImageUrl, userObject, navigate, isCurrentUser }) => {
//     return (
//       <>
//         <div className="card Profile-shadow Card">
//           {/* {(isCurrentUser) && <Button id="card__button_cta" onClick={() => navigate(`/museum/`+ _id)}>Edit </Button>}
//           <Button id="card__button" >Visit</Button> */}
//           <img src={imageUrl} className="card__image"/>
//             <div className="card__overlay">
//               <div className="card__header">
//                 <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
//                 <img className="card__thumb" src={userObject.imageUrl} alt="" onClick={
//                   () => {
//                     if (isCurrentUser) {
//                       navigate(`/profile/`)
//                     } else {
//                       navigate(`/profile/`+ userObject._id)
//                     }
//                   }}
//                   />
//                 <div className="card__header-text">
//                   <h3 className="card__title">{name}</h3>
//                 <span className="card__status">1 hour ago</span><br/>
//                 {isPrivate && <span className="card__status">Private</span>}
//               </div>
//             </div>
//             <p class="card__description">{description}</p>
//         </div>
//         </div>
//       </>
//     )
//   }

export { MuseumCard };
