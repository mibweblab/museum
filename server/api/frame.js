const express = require("express");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/frame");
const {isUserLoggedIn} = require("../middleware/frame");
const museum = require("../models/museum");

router.post("/", [isUserLoggedIn],async (req, res) => {

  let userId = req.session.user._id
  let { type, name, imageUrl, text, frameColor, position, rotation} = req.body;

  const frame = await addFrame(
    type,
    name,
    imageUrl,
    text,
    frameColor,
    position,
    rotation,
    userId
  );
  if (frame) {
    res.send(frame);
  } else {
    res.status(401).send({});
  }
});

router.get("/",[isUserLoggedIn] ,async (req, res) => {
  let allFrames = await getAllFrames(museumId);
  if (allFrames) {
    res.send(allFrames);
  } else {
    res.status(401).send({});
  }
});

router.patch("/:frameId", async (req, res) => {
    let frameId = req.params.frameId;
    let {data} = req.body;
    if (response){
      res.status(200).send("Sucessfully deleted frame")
    }else{
      res.status(304).send({"error": `Failed to delete frame with id ${frameId}`})
    }
});

router.delete("/:frameId", async (req,res)=>{
    let frameId = req.params.frameId;
    let response = await deleteFrame(frameId);
    if (response){
      res.status(200).send("Sucessfully deleted frame")
    }else{
      res.status(304).send({"error": `Failed to delete frame with id ${frameId}`})
    }
})

module.exports = router;
