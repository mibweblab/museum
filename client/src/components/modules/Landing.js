import React from "react";
import {Button} from "semantic-ui-react";
import './Landing.scss';
// import MuseumAPI from '../../api/museum';


const LandingPage = () => {
    return (
        <div className="Page">
            <div className="Page-header">
                <Button color="blue" onClick={(e)=> console.log("I'm clicking")}>Create Museum</Button>
            </div>
            <div className="Page-body">

            </div>
        </div>
    )
}


export default LandingPage;