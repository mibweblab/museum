const express = require("express");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/frame");
const { isUserLoggedIn, doesFrameExist, doesMuseumExist } = require("../middleware/index");

/**
 *
 * POST /api/frame
 * adds a new frame obj to the databse
 *
 */

router.post("/", [isUserLoggedIn], async (req, res) => {
  let { type, name, imageUrl, text, frameColor, position, rotation, scale,imageZoomRatio, parentId, figure } = req.body;

  const frame = await addFrame(
    type,
    name,
    imageUrl,
    text,
    frameColor,
    position,
    rotation,
    scale,
    imageZoomRatio,
    parentId,
    figure
  );

  if (frame) {
    res.status(200).send(frame);
  } else {
    res.status(401).send({});
  }
});

/**
 * GET api/frame/:museumId
 *
 * gets all frames associated with a user museumId
 *
 */
router.get("/:museumId", [isUserLoggedIn, doesMuseumExist], async (req, res) => {
  let museumId= req.params.museumId;
  let allFrames = await getAllFrames(museumId);
  if (allFrames) {
    res.send(allFrames);
  } else {
    res.status(401).send({});
  }
});

/**
 * PATCH api/frame/:frameId
 *
 * edits a specific frame 's property with a frameId
 *
 */
router.patch("/:frameId", [isUserLoggedIn, doesFrameExist],async (req, res) => {

  let frameId = req.params.frameId;
  let data  = req.body;
  let response = await editFrame(frameId, data);
  if (response) {
    res.status(200).send("Sucessfully deleted frame");
  } else {
    res.status(304).send({ error: `Failed to delete frame with id ${frameId}` });
  }
});

/**
 *
 * DELETE api/frame/:frameId
 *
 * deletes a specific frame with frameId
 *
 */
router.delete("/:frameId",[isUserLoggedIn, doesFrameExist],async (req, res) => {
  let frameId = req.params.frameId;
  let response = await deleteFrame(frameId);
  if (response) {
    res.status(200).send("Sucessfully deleted frame");
  } else {
    res.status(304).send({ error: `Failed to delete frame with id ${frameId}` });
  }
});

// router.all("*", (req, res) => {
//   console.log(`API route not found: ${req.method} ${req.url}`);
//   res.status(404).send({ msg: "API route not found" });
// });

module.exports = router;
