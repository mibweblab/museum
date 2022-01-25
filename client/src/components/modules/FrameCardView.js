import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactCardFlip from "react-card-flip";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import "./FrameCard.scss";
import { addCurrentFrame, editCurrentFrame, addInitialFrames } from "../action";
import APIInterface from "../../api/api";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
      <Card className="FrameCard" sx={{ width: 345 }}>
        <CardHeader
          title={internalName}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {internalText}
          </Typography>
        </CardContent>
      </Card>
  );
}
