import axios from "axios";
import { get } from "../utilities"

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
    
  static async getCurrentMuseum(id) {
    try {
      // console.log("am trying")
      let museum = await axios.get("/api/museum/" + id);
      return museum;
    } catch (error) {
      return false;
    }
  }

static async editMuseumProperty(id,data){
    // console.log("am I being called")
    try {
      // console.log("am i being triggered")
      let museum = await axios.patch("/api/museum/" + id,data);
      return museum;
} catch (error) {
  return false;
}
}


static async getUserProfileAndPublicMuseums(userId) {
  try {
    let obj = await axios.get("/api/museum/profile/"+userId);   
    const museums = obj.data
    let profile = await  get(`/api/user`, { userid: userId })
    return { museums, profile} ;
  } catch (error) {
    return false;
  }
}