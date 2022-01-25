import React,  { useState, useEffect }  from "react";
import { Button } from "semantic-ui-react";
import {Link, navigate} from "@reach/router"
import {Card} from "react-bootstrap"
import './Explore.scss';
import { MuseumCard } from "./Card";

import MuseumInterface from "../../api/museum";
// import { allSettled } from "core-js/fn/promise";


const Explore = ({currentUserId }) => {
    const [allPublicMuseums, setAllPublicMuseums] = useState([]);

    const retrievePublicMuseums = async () => {
        let m = await MuseumInterface.getAllPublicMuseums()
        setAllPublicMuseums(m.data)
      }

    useEffect(()=>{
        retrievePublicMuseums()
    }, []);

    console.log("here are the public",allPublicMuseums)

  return (
    <div className="Explore">
      <div className="Explore-cards">
        {allPublicMuseums.map(
          (props,index) => <MuseumCard key={props._id} {...props} navigate={navigate} isCurrentUser={props.userId== currentUserId} /> /* prettier-ignore */
        )}
      </div>
    </div>
  );
};

export default Explore;
