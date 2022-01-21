import React,  { useState, useEffect }  from "react";
import { Button } from "semantic-ui-react";
import {Link} from "@reach/router"
import {Card} from "react-bootstrap"
import './Profile.scss';
import { MuseumCard } from "./Profile";

import MuseumInterface from "../../api/museum";


const Explore = ({LogInStatus}) => {
    const [allPublicMuseums, setAllPublicMuseums] = useState([]);

    const retrievePublicMuseums = async () => {
        let m = await MuseumInterface.getAllPublicMuseums()
        setAllPublicMuseums(m.data)
      }

    useEffect(()=>{
        retrievePublicMuseums()
    }, []);


    console.log(LogInStatus)
  return (
    <div className="Profile">
      {LogInStatus ? <Link to="/profile">My Wander</Link> : <Link to="/">Create Your Own</Link>}
      <div className="Profile-museums">
        {allPublicMuseums.map(
          (props,index) => <MuseumCard key={props._id} {...props}/> /* prettier-ignore */
        )}
      </div>
    </div>
  );
};

export default Explore;
