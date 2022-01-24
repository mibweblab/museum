import axios from "axios";

export default class API {
  static async addMuseum(name, description, isPrivate, imageUrl) {
    try {
      let museum = await axios.post("/api/museum", {
        name,
        description,
        isPrivate,
        imageUrl,
      });

      return museum;
    } catch (error) {
      return false;
    }
  }

  static async getAllMuseums() {
    try {
      let museums = await axios.get("/api/museum");
      return museums;
    } catch (error) {
      return false;
    }
  }

  static async getAllPublicMuseums() {
    try {
      let museums = await axios.get("/api/museum/explore");
      return museums;
    } catch (error) {
      return false;
    }
  }
}
