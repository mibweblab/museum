const express = require("express");
const router = express.Router();
const { isUserLoggedIn } = require("../middleware/frame");

const {
  addMuseum,
  getAllMuseums,
  deleteMuseum,
  editMuseumProperty,
  getAllPublicMuseums,
  getMuseum
} = require("../controllers/museum");


/**
 * POST /api/museum
 * 
 * adds a museum obj via this api
 */
router.post("/", [isUserLoggedIn], async (req, res) => {
  let userId = req.session.user._id;
  let { name, description, isPrivate, imageUrl } = req.body;
  const museum = await addMuseum(name, description, isPrivate, imageUrl, userId);
  if (museum) {
    res.send(museum);
  } else {
    res.status(401).send({});
  }
});

/**
 * GET /api/museum
 * 
 * gets all museums associated with a registered user
 */
router.get("/", [isUserLoggedIn], async (req, res) => {
  let userId = req.session.user._id;
  let allMuseums = await getAllMuseums(userId, false);
  if (allMuseums) {
    res.send(allMuseums);
  } else {
    res.status(401).send({});
  }
});

/**
 * PATCH /api/museum
 * 
 * edits a meta property for a museum
 */
router.patch("/:museumId", [isUserLoggedIn], async (req, res) => {
  let museumId = req.params.museumId;
  let data = req.body;
  // console.log(req.body)
  // console.log(data);
  let response = await editMuseumProperty(museumId, data);
  if (response){
    res.status(200).send("Sucessfully edited museum")
  }else{
    res.status(304).send({"error": `Failed to edit museum with id ${museumId}`})
  }
});

/**
 * 
 * DELETE /api/museum
 * deletes a museum
 * 
 */
router.delete("/:museumId", [isUserLoggedIn], async (req, res) => {
  let museumId = req.params.museumId;
  let response = await deleteMuseum(museumId);
  if (response){
    res.status(200).send("Sucessfully deleted museum")
  }else{
    res.status(304).send({"error": `Failed to delete museum with id ${museumId}`})
  }
});

router.get("/explore", [], async (req, res) => {
  let allPublicMuseums = await getAllPublicMuseums();
  if (allPublicMuseums) {
    res.send(allPublicMuseums);
  } else {
    res.status(401).send({});
  }
});

router.get("/profile/:userId", [], async (req, res) => {
  let userId = req.params.userId;
  let userPublicMuseums = await getAllMuseums(userId, true);
  if (userPublicMuseums) {
    res.send(userPublicMuseums);
  } else {
    res.status(401).send({});
  }
});


/**
 * 
 * GET /api/museum/:museumId
 * gets a museum
 * 
 */
 router.get("/:museumId", [isUserLoggedIn], async (req, res) => {
  let museumId = req.params.museumId;
  let response = await getMuseum(museumId);

  // console.log("htiting the backedn",response)
  if (response){
    res.status(200).send(response)
  }else{
    res.status(304).send({"error": `Failed to get museum with id ${museumId}`})
  }
});
module.exports = router;
