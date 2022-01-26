import React,  { useState, useEffect }  from "react";
import { Button } from "semantic-ui-react";
import {Link, navigate} from "@reach/router"
import {Card} from "react-bootstrap"
import './Explore.scss';
import { MuseumCard } from "./Card";
import MuseumInterface from "../../api/museum";
import { connect } from "react-redux";
// import { allSettled } from "core-js/fn/promise";


const Explore = ({currentUserId, dispatch }) => {
    const [allPublicMuseums, setAllPublicMuseums] = useState([]);

    const retrievePublicMuseums = async () => {
        let m = await MuseumInterface.getAllPublicMuseums()
        setAllPublicMuseums(m.data)
      }

    useEffect(()=>{
        retrievePublicMuseums()
    }, []);
  
  const filterMuseums = (id) =>{
      setAllPublicMuseums(allPublicMuseums.filter((m)=>m._id!==id))
  }

  return (
    <div className="Explore">
      <div className="Explore-cards">
        {allPublicMuseums.map(
          (props,index) => <MuseumCard dispatch={dispatch} filterMuseums={filterMuseums} key={props._id} {...props} navigate={navigate} isCurrentUser={props.userId== currentUserId} /> /* prettier-ignore */
        )}
      </div>
    </div>
  );
};

export default connect()(Explore);
