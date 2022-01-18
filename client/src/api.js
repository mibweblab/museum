import axios from "axios";

export default class APIInterface {
  static async addFrame(type, name, imageUrl, text, frameColor, position, rotation) {
    try {
      let frame = await axios.post("/api/frame", {
        type,
        name,
        imageUrl,
        text,
        frameColor,
        position,
        rotation,
      });

      return frame;
    } catch (error) {
      return false;
    }
  }

  static async getAllFrames() {
    try {
      console.log("firing api")
      let frames = await axios.get("/api/frame");
      console.log(frames)
      return frames;
    } catch (error) {
      return false;
    }
  }
}
