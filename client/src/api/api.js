import axios from "axios";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  });

const maxTokens = 1000;  
const maxResponseLen = 200;
const openai = new OpenAIApi(configuration);


export default class FrameAPI {

  static async addFrame(type, name, imageUrl, text, frameColor, position, rotation,parentId) {
    try {
      let frame = await axios.post("/api/frame", {
        type,
        name,
        imageUrl,
        text,
        frameColor,
        position,
        rotation,
        parentId
      });

      return frame;
    } catch (error) {
      return false;
    }
  }

  static async getAllFrames(parentId) {
    try {
      // console.log("firing api")
      let frames = await axios.get("/api/frame/"+parentId);
      console.log(frames)
      return frames;
    } catch (error) {
      return false;
    }
  }

  static async sendGPT3Request(payload) {
    try {
      const response = await openai.createCompletion("davinci", payload);
      return response
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
