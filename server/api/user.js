const express = require("express");
const router = express.Router();
const { isUserLoggedIn } = require("../middleware/frame");

const {
    editUser,

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

  let response = await editUser(userId, data);
  if (response){

    req.session.user = data;
    res.send(response)
  }else{
    res.status(304).send({"error": `Failed to edit user with id ${userId}`})
  }
});


module.exports = router;
