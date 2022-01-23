const express = require("express");
const router = express.Router();
const { addFrame, editFrame, deleteFrame, getAllFrames } = require("../controllers/frame");
const { isUserLoggedIn } = require("../middleware/frame");

/**
 *
 * POST /api/frame
 * adds a new frame obj to the databse
 *
 */

router.post("/", [isUserLoggedIn], async (req, res) => {
  let { type, name, imageUrl, text, frameColor, position, rotation, scale,imageZoomRatio, parentId } = req.body;

  console.log("adding a frame", req.body)

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
    parentId
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
router.get("/:parentId", [isUserLoggedIn], async (req, res) => {
  let parentId= req.params.parentId;
  let allFrames = await getAllFrames(parentId);
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
router.patch("/:frameId", async (req, res) => {

  let frameId = req.params.frameId;
  let { data } = req.body;
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
router.delete("/:frameId", async (req, res) => {
  let frameId = req.params.frameId;
  let response = await deleteFrame(frameId);
  if (response) {
    res.status(200).send("Sucessfully deleted frame");
  } else {
    res.status(304).send({ error: `Failed to delete frame with id ${frameId}` });
  }
});

module.exports = router;
