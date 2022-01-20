import axios from "axios";

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
}
