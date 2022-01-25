import React from "react";
import "./Controls.scss";

const Controls = ({openModal, setModalType}) => {
  return (
  <div className="Controls">
      <button onClick={openModal} className="Controls-button">Framer</button>
      {/* <button onClick={dropFrame} className="Controls-button">Drop Frame</button> */}
  </div>)
};

export default Controls;