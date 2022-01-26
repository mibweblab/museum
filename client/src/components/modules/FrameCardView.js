import React, { useEffect, useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";


import "./FrameCard.scss";
import { addCurrentFrame, editCurrentFrame, addInitialFrames } from "../action";
import APIInterface from "../../api/api";


export default function FrameCard({ name, text, frameToTransform, dispatch, parentId, currentFrame }) {
  const [internalName, setInternalName] = useState("");
  const [internalText, setInternalText] = useState("");

  const nameRef = useRef();
  const textRef = useRef();


  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (name) {
      setInternalName(name);
      setInternalText(text);
    } else {
      setInternalName("Frame");
      setInternalText("Click on a frame to see details");
    }
  }, [name, text]);

  const [isFlipped, setIsFlipped] = useState(false);

  return (
      <div className="FrameCard">
        <div className="FrameCard-title">
          {internalName}
        </div>
        <div className="FrameCard-description">
          {internalText}
        </div>
      </div>
  );
}
