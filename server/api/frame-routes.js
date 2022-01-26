const express = require("express");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/frame");
const {isUserLoggedIn} = require("../middleware/index");

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
  let userId = req.session.user._id;

  // console.log(userId, "I'm hitting this end point");
  let allFrames = await getAllFrames(userId);
  if (allFrames) {
    res.send(allFrames);
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

// router.all("*", (req, res) => {
//   console.log(`API route not found: ${req.method} ${req.url}`);
//   res.status(404).send({ msg: "API route not found" });
// });

module.exports = router;
