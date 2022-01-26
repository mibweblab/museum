const Frame = require("../models/frame");
const Museum = require("../models/museum");

const isUserLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.status(400).json({
      error: "You are not logged in",
    });
  } else {
    next();
  }
};

const doesFrameExist = async (req,res,next) =>{
  let frameId = req.params.frameId;
  try{
    let frame = await Frame.findOne({_id: frameId});
    if (frame){
      next()
    }else{
      res.status(401).send("Could not find frame")
    }

  }catch{
    res.status(401).send("Frame not found")
  }
}


const doesMuseumExist = async (req,res,next) =>{
  let museumId = req.params.museumId;
  try{
    let museum = await Museum.findOne({_id: museumId});
    if (museum){
      next()
    }else{
      res.status(401).send("Could not find frame")
    }

  }catch{
    res.status(401).send("Frame not found")
  }
}

module.exports = Object.freeze({isUserLoggedIn, doesFrameExist, doesMuseumExist})