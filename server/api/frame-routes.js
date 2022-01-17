const express = require("express");
// const { useImperativeHandle } = require("react");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/frame");

router.post("/", async (req, res) => {
  let userId = req.session.user.googleId;
  console.log("hitting the endpoint",req.body)
  let { type, name, imageUrl, text, frameColor, position, rotation, subframes } = req.body;
  // const frame = await addFrame(
  //   type,
  //   name,
  //   imageUrl,
  //   text,
  //   frameColor,
  //   position,
  //   rotation,
  //   subframes,
  //   userId
  // );
  // if (frame) {
  //   res.send(frame);
  // } else {
  //   res.status(401).send({});
  // }
});

router.get("/", async (req, res) => {
  let userId = req.session.user.googleId;
  let allFrames = await getAllFrames(userId);

  if (allFrames) {
    res.send(frame);
  } else {
    res.status(401).send({});
  }
});

router.patch("/:frameId", async (req, res) => {
    let frameId = req.params.frameId;
    let {data} = req.body;
    await editFrame(frameId, data);


});

router.delete("/:frameId", async (req,res)=>{
    let frameId = req.params.frameId;
    await deleteFrame(frameId);

    res.send({})
})

module.exports = router;
