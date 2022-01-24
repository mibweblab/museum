import axios from "axios";

export default class UserApi {

  static async updateUser(userId, data) {
    try {

      let user = await axios.patch("/api/user/"+userId, data);
      return user;
    } catch (error) {
      return false;
    }
  }


}