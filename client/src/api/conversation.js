import axios from "axios";

export default class ConversationAPI {

  static async addConversation(firstName, lastName, frameId, description) {
    try {
      let conversation = await axios.post("/api/conversation", {
        firstName,
        lastName,
        frameId,
        description,

      });
      return conversation;
    } catch (error) {
      return false;
    }
  }

  static async getConversation(frameId) {
    try {
      // console.log("firing api")
      let converation = await axios.get("/api/conversation/"+frameId);
      console.log(converation)
      return converation;
    } catch (error) {
      return false;
    }
  }
}