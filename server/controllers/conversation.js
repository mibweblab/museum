const Conversation = require("../models/conversation");

async function addConversation(firstName, lastName, description, frameId, frameUrl) {
  try {
    let conversation = Conversation({
      firstName: firstName,
      lastName: lastName,
      description: description,
      frameId: frameId,
      frameUrl: frameUrl,
    });
    return await conversation.save();
  } catch (error) {
    console.log("error saving", error)
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

async function editConversation(conversationId,data){

    try {
        await Conversation.updateOne({_id:conversationId},data);
        return true;
    } catch (error){
        return false;
    }
}


/**
 * 
 * Deletes a frame with a specific frameId
 * @param {*} frameId 
 * @returns 
 */
async function deleteConversation(frameId){
  try {
      await Conversation.deleteOne({frameId: frameId});
      return true;
  } catch (error) {
      return false;
  }
}

/**
 * Needs to get all Frames
 * @param {*} userId 
 * @returns 
 */
 async function getConversation(frameId){
  try {
      let conversationFound = await Conversation.findOne({frameId: frameId})
      return conversationFound;
  } catch (error) {
      return false;
  }
}


module.exports = Object.freeze({ addConversation, editConversation, deleteConversation, getConversation });