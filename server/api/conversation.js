const express = require("express");
const router = express.Router();
const { addConversation, editConversation, deleteConversation, getConversation } = require("../controllers/conversation");
const { isUserLoggedIn } = require("../middleware/frame");

/**
 *
 * POST /api/conversation
 * add a new conversation obj to the databse
 *
 */

router.post("/", [isUserLoggedIn], async (req, res) => {
  let { firstName, lastName, frameId, description } = req.body;

  const conversation = await addConversation(
    firstName,
    lastName,
    frameId,
    description,
  );
  if (conversation) {
    res.send(conversation);
  } else {
    res.status(304).send({});
  }
});

/**
 * GET api/conversation/:frameId
 *
 * gets conversation associated with a frameId 
 *
 */
router.get("/:frameId", [isUserLoggedIn], async (req, res) => {
  let frameId= req.params.frameId;
  let conversationFound = await getConversation(frameId);
  if (conversationFound) {
    res.send(conversationFound);
  } else {
    res.status(401).send({});
  }
});

/**
 * PATCH api/conversation/:conversationId
 *
 * edits a specific conversation 's property with a frameId
 *
 */
router.patch("/:conversationId", async (req, res) => {
  let conversationId = req.params.conversationId;
  let { data } = req.body;
  let response = await editConversation(conversationId, data);
  if (response) {
    res.status(200).send("Sucessfully deleted frame");
  } else {
    res.status(304).send({ error: `Failed to patch conversation with conversation id ${conversationId}` });
  }
});

/**
 *
 * DELETE api/conversation/:frameId
 *
 * deletes a specific conversation with frameId
 *
 */
router.delete("/:frameId", async (req, res) => {
  let frameId = req.params.frameId;
  let response = await deleteConversation(frameId);
  if (response) {
    res.status(200).send("Sucessfully deleted conversation");
  } else {
    res.status(304).send({ error: `Failed to delete conversation with frameId ${frameId}` });
  }
});

module.exports = router;
