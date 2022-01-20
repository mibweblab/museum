import React from "react";
import FrameCustomizer from "./FrameCustomizer";
import './ModalViewer.scss';
import MuseumForm from "./MuseumForm";

const ModalViewer = ({ Modal, open, close, isOpen, modalType, snap }) => {

    return (
      <Modal>
        <div className="ModalViewer">
          <div className="ModalViewer-header"></div>
          <div className="ModalViewer-body">
            {modalType === "frame" && <FrameCustomizer close={close} snap={snap} />}
            {modalType === "museum" && <MuseumForm close={close} snap={snap} />}
          </div>
          <div className="ModalViewer-footer">
            <button onClick={close}>Close</button>
          </div>
        </div>
      </Modal>
    );
};
  

export default ModalViewer