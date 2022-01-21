import React from "react";
import { Button } from "semantic-ui-react";
import {Link} from "@reach/router"
import {Card} from "react-bootstrap"
import './Profile.scss';


const MuseumCard = ({ imageUrl, name, description,_id }) => {
  return (
    <Card style={{ width: "18rem", margin: "24px" }}>
      <Card.Img className="Profile-card-img" variant="top"  src={imageUrl} />
      <Card.Body className="Profile-card-body">
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Link to={`/museum/`+ _id }>Enter</Link>
      </Card.Body>
    </Card>
  );
};

const Profile = ({museums}) => {
  // console.log("images have changed", museums)
  return (
    <div className="Profile">
      <div className="Profile-museums">
        {museums.map(
          (props,index) => <MuseumCard key={props._id} {...props} /> /* prettier-ignore */
        )}
      </div>
    </div>
  );
};

export { Profile, MuseumCard} ;
