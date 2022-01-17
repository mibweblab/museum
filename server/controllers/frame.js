const Frame = require("../models/frame");


async function addFrame(type, name, imageUrl, text, frameColor, position, rotation, subframes,userId) {
  try {
    let frame = Frame({
      type: type,
      name: name,
      imageUrl: imageUrl,
      text: text,
      frameColor: frameColor,
      position: position,
      rotation: rotation,
      subframes: subframes,
      userId: userId,
    });
    await frame.save();
  } catch (error) {
    return false;
  }
}

/**
 * 
 * Needs to be fleshed out more
 * @param {*} frameId 
 * @param {*} data 
 * @returns 
 */

async function editFrame(frameId,data){

    try {
        await Frame.updateOne({_id:frameId},data);
        return true;
    } catch (error){
        return false;
    }
}

/**
 * Needs to get all Frames
 * @param {*} userId 
 * @returns 
 */
async function getAllFrames(userId){
    try {
        return await Frame.find({userId: userId})
    } catch (error) {
        return false;
    }
}

async function deleteFrame(frameId){
  try {
      await Frame.deleteOne({_id: frameId});
      return true;
  } catch (error) {
      return false;
  }
}

module.exports = Object.freeze({ addFrame, editFrame, getAllFrames, deleteFrame });