import React from "react";
import "./Controls.scss";

const Controls = ({clickLeft, clickRight, clickUp, clickDown}) => {
  return (
  <div className="Controls">
    <div className="Controls-keys">
      <div className="Control-group">
        <button className="Control-key" onMouseDown={(e)=>(e.stopPropagation(),clickUp(true))}   onMouseUp={(e)=>(e.stopPropagation(),clickUp(false))}>
            W || UP
        </button>      
      </div>
      <div className="Control-group">
          <button className="Control-key" onMouseDown={(e)=>(e.stopPropagation(),clickLeft(true))}   onMouseUp={(e)=>(e.stopPropagation(),clickLeft(false))}>
              A || LEFT
          </button>
          <button className="Control-key" onMouseDown={(e)=>(e.stopPropagation(),clickRight(true))}   onMouseUp={(e)=>(e.stopPropagation(),clickRight(false))}>
              D || RIGHT
          </button>
      </div>
      <div className="Control-group">
        <button className="Control-key" onMouseDown={(e)=>(e.stopPropagation(),clickDown(true))}   onMouseUp={(e)=>(e.stopPropagation(),clickDown(false))}>
            S || DOWN
        </button>
      </div>
    </div>
  </div>)
};

export default Controls;