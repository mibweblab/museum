const express = require("express");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/museum");
const { isUserLoggedIn } = require("../middleware/frame");

const {
  addMuseum,
  getAllMuseums,
  deleteMuseum,
  editMuseumProperty,
} = require("../controllers/museum");

router.post("/", [isUserLoggedIn], async (req, res) => {
  let userId = req.session.user._id;
  let { name, description, isPrivate, imageUrl, userId } = req.body;

  const museum = await addMuseum(name, description, isPrivate, imageUrl, userId);
  if (museum) {
    res.send(museum);
  } else {
    res.status(401).send({});
  }
});

router.get("/", [isUserLoggedIn], async (req, res) => {
  let userId = req.session.user._id;

//   console.log(userId, "I'm hitting this end point");
  let allFrames = await getAllMuseums(userId);
  if (allFrames) {
    res.send(allFrames);
  } else {
    res.status(401).send({});
  }
});

router.patch("/:frameId", async (req, res) => {
  let frameId = req.params.frameId;
  let { data } = req.body;
  await editFrame(frameId, data);
});

router.delete("/:frameId", async (req, res) => {
  let frameId = req.params.frameId;
  await deleteFrame(frameId);

  res.send({});
});

module.exports = router;
