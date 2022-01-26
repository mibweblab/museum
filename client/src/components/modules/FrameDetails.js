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
import { deleteCurrentFrame, addCurrentFrame , addFrameToTransform} from "../action";
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
    <ReactCardFlip
      containerStyle={{ position: "absolute", top: "40%", zIndex: "999", left: "32px" }}
      isFlipped={isFlipped}
      className="FrameCard"
      flipDirection="vertical"
    >
      <Card sx={{ width: 345 }}>
        <CardHeader
          action={
            <IconButton aria-label="edit" onClick={() => setIsFlipped(!isFlipped)}>
              <EditIcon />
            </IconButton>
          }
          title={internalName}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {internalText}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="share">
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Card sx={{ width: 345 }} className="Card">
        <CardHeader
          action={
            <IconButton onClick={() => setIsFlipped(!isFlipped)} aria-label="settings">
              <ThreeSixtyIcon />
            </IconButton>
          }
          title={name}
        />
        <CardContent className="Card-content">
          <TextField
            defaultValue={internalName}
            inputRef={nameRef}
            onChange={(e) => {
              setInternalName(e.target.value);
              console.log(internalName);
            }}
            className="Card-field"
            id="standard-basic"
            label="Name"
            variant="standard"
          >
            {" "}
          </TextField>
          <TextField
            id="standard-multiline-static"
            label="Description"
            multiline
            rows={4}
            // defaultValue={internalText}
            placeholder={internalText}
            variant="standard"
            className="Card-field"
            onChange={(e) => setInternalText(e.target.value)}
            inputRef={textRef}
          />
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={async ()=>{
             if (currentFrame?.current?.userData?.id){      
                let response = await APIInterface.deleteFrame(currentFrame?.current?.userData?.id)
                if (response){
                  dispatch(deleteCurrentFrame(currentFrame?.current?.userData?.id));
                  dispatch(addCurrentFrame(null))
                  dispatch(addFrameToTransform(""))
                }
             }
          }} aria-label="share">
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={async () => {
              let nameToSave = nameRef.current.value.length > 0 ? internalName : name;
              let descriptionToSave = textRef.current.value.length > 0 ? internalText : text;
            
              let response = await APIInterface.editFrameProperty(frameToTransform, {
                text: descriptionToSave,
                name: nameToSave,
              });

              if (response) {
                if (currentFrame?.current?.userData){
                    currentFrame.current.userData.name = nameToSave;
                    currentFrame.current.userData.text = text;
                }
              }
              textRef.current.value = "";
              nameRef.current.value = "";
            }}
            aria-label="share"
          >
            <SaveIcon />
          </IconButton>
        </CardActions>
      </Card>
    </ReactCardFlip>
  );
}
