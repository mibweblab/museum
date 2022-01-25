import React from "react";
import FrameCustomizer from "./FrameCustomizer";
import './ModalViewer.scss';
import MuseumForm from "./MuseumForm";
import UserForm from "./UserForm";

const ModalViewer = ({ Modal, open, close, isOpen, modalType, snap, user, editUserFunction }) => {

    return (
      <Modal>
        <div className="ModalViewer">
          <div className="ModalViewer-header"></div>
          <div className="ModalViewer-body">
            {modalType === "frame" && <FrameCustomizer close={close} snap={snap} />}
            {modalType === "museum" && <MuseumForm close={close} snap={snap} />}
            {modalType === "user" && <UserForm close={close} snap={snap} user={user} editUserFunction={editUserFunction} />}
          </div>
        </div>
      </Modal>
    );
};
  

export default ModalViewer