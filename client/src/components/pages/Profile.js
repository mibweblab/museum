import React from "react";
import { Button } from "semantic-ui-react";
import {Link} from "@reach/router"
import {Card} from "react-bootstrap"
import './Profile.scss';


const MuseumCard = ({ imageUrl, name, description,_id }) => {
  return (
    <Card style={{ width: "18rem", margin: "24px" }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Link to={`/museum/view/`+ _id }>View</Link>
        <Link to={`/museum/edit/`+ _id }>Edit</Link>
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

export default Profile;
