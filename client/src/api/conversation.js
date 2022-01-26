import axios from "axios";

export default class ConversationAPI {

  static async addConversation(firstName, lastName, description, frameId, frameUrl) {
    try {
      let conversation = await axios.post("/api/conversation", {
        firstName,
        lastName,
        description,
        frameId,
        frameUrl,
      });
      return conversation;
    } catch (error) {
      return false;
    }
  }

  static async getConversation(frameId) {
    try {
      let converation = await axios.get("/api/conversation/"+frameId);
      return converation;
    } catch (error) {
      return false;
    }
  }
}