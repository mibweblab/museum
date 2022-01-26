import axios from "axios";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  });

const maxTokens = 1000;  
const maxResponseLen = 200;
const openai = new OpenAIApi(configuration);


export default class FrameAPI {

  static async addFrame(type, name, imageUrl, text, frameColor, position, rotation,scale,imageZoomRatio,parentId) {
    try {
      let frame = await axios.post("/api/frame", {
        type,
        name,
        imageUrl,
        text,
        frameColor,
        position,
        rotation,
        scale,
        imageZoomRatio,
        parentId
      });

      return frame;
    } catch (error) {
      return false;
    }
  }

  static async getAllFrames(parentId) {
    try {
      let frames = await axios.get("/api/frame/"+parentId);
      return frames;
    } catch (error) {
      return false;
    }
  }
  static async deleteFrame(id) {
    try {
      let frame = await axios.delete("/api/frame/" + id);
      return frame;
    } catch (error) {
      return false;
    }
  }

  static async editFrameProperty(id,data) {
    console.log("what am I sending", data)
    try {
      let frame = await axios.patch("/api/frame/" + id,data);
      return frame;
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
