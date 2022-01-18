import React from "react";
import "./Controls.scss";

const Controls = ({openModal, setModalType}) => {
  return (
  <div className="Controls">
      <button className="Controls-button">Editor</button>
      <button onClick={openModal} className="Controls-button">Framer</button>
      {/* <button onClick={dropFrame} className="Controls-button">Drop Frame</button> */}
  </div>)
};

export default Controls;