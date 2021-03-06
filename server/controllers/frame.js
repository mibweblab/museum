const Conversation = require("../models/conversation");
const Frame = require("../models/frame");

async function addFrame(type, name, imageUrl, text, frameColor, position, rotation, scale, imageZoomRatio,parentId, figure) {
  try {
    let frame = Frame({
      type: type,
      name: name,
      imageUrl: imageUrl,
      text: text,
      frameColor: frameColor,
      position: position,
      rotation: rotation,
      scale: scale,
      imageZoomRatio: imageZoomRatio,
      parentId: parentId,
      figure: figure
    });
    return await frame.save();
  } catch (error) {
    // console.log("error saving", error)
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

    // console.log("trying to update",frameId,data);
    try {

        
        await Frame.updateOne({_id:frameId},data);
        // console.log("succssfukky updated")/
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
async function getAllFrames(parentId){
    try {
        let framesFound = await Frame.find({parentId: parentId})
        return framesFound;
    } catch (error) {
        return false;
    }
}

/**
 * 
 * Deletes a frame with a specific frameId
 * @param {*} frameId 
 * @returns 
 */
async function deleteFrame(frameId){
  try {
      let frame = await Frame.findOne({_id:frameId});
      if (frame){
        if (frame.type==="conversation" || frame.type==="premade_conversation"){
          await Conversation.deleteOne({frameId: frameId});
        }
        await Frame.deleteOne({_id: frameId});
      }
      return true;
  } catch (error) {
      return false;
  }
}


// /**
//  * 
//  * Deltes a 
//  * @param {*} frameId 
//  * @returns 
//  */
// async function deleteFrame(frameId){
//   try {
//       await Frame.deleteOne({_id: frameId});
//       return true;
//   } catch (error) {
//       return false;
//   }
// }

module.exports = Object.freeze({ addFrame, editFrame, getAllFrames, deleteFrame });
