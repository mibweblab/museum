const express = require("express");
const router = express.Router();
const { isUserLoggedIn } = require("../middleware/index");

const {
    editUserFunction,
} = require("../auth")



/**
/**
 * PATCH /api/user
 * 
 * edits user
 */
router.patch("/:userId", [isUserLoggedIn], async (req, res) => {
  let userId = req.params.userId;
  let  data  = req.body;

  let response = await editUserFunction(userId, data);
  if (response){

    req.session.user = data;
    res.send(response)
  }else{
    res.status(304).send({"error": `Failed to edit user with id ${userId}`})
  }
});

// router.all("*", (req, res) => {
//   console.log(`API route not found: ${req.method} ${req.url}`);
//   res.status(404).send({ msg: "API route not found" });
// });

module.exports = router;
