import axios from "axios";

export default class APIInterface {
  static async addFrame(type, name, imageUrl, text, frameColor, position, rotation, subframes) {
    let frame = await axios.post("/api/frame", {
      type,
      name,
      imageUrl,
      text,
      frameColor,
      position,
      rotation,
      subframes,
    });

    return frame;
  }
}
