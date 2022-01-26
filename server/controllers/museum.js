const Museum = require("../models/museum");

// I am not sure if the shorthand is still valid, but I dnt care at this point
//

/**
 *
 * Given the following params, creates a museum hall
 *
 * @param {*} name
 * @param {*} description
 * @param {*} isPrivate
 * @param {*} imageUrl
 * @param {*} userId
 * @returns
 */
async function addMuseum(name, description, isPrivate, imageUrl, userId) {
  try {
    let museum = Museum({
      name: name,
      description: description,
      isPrivate: isPrivate,
      imageUrl: imageUrl,
      userId: userId,
    });

    return await museum.save();
    // return true
  } catch (error) {
    console.log("error saving", error);
    return false;
  }
}

/**
 *
 * edits a museum property
 *
 * @param {*} museumId
 * @param {*} data
 * @returns
 */
async function editMuseumProperty(museumId, data) {
  // console.log(museumId, data);
  try {
    await Museum.updateOne({ _id: museumId }, data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets all museums associated with a certain userId, bool: publicMuseumsOnly
 * @param {*} userId 
 * @returns 
 */

async function getAllMuseums(userId, publicMuseumsOnly) {
  try {
    if (publicMuseumsOnly) {
      return await Museum.find({userId: userId, isPrivate: false});
    } else {
      return await Museum.find({userId: userId});
    }
  } catch (error) {
    console.log("error getting all museums", error);
    return false;
  }
}

/**
 *
 * Delete a museum with a certain userId
 *
 *
 */
async function deleteMuseum(museumId) {
  try {
    await Museum.deleteOne({ _id: museumId });
    return true;
  } catch (error) {
    return false;
  }
}


/**
 * Gets all public museums 
 * @param {*} userId 
 * @returns 
 */

 async function getAllPublicMuseums() {
  const agg = [
    {
      '$addFields': {
        'userIdObject': {
          '$toObjectId': '$userId'
        }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userIdObject', 
        'foreignField': '_id', 
        'as': 'userObject'
      }
    }, {
      '$unwind': {
        'path': '$userObject'
      }
    }, {
      '$match': {
        'isPrivate': false
      }
    }
  ]
  try {
    return await Museum.aggregate(agg);


  } catch (error) {
    console.log("error getting all museums", error);
}
}
/**
 *
 * Gets a museum with a certain museumId
 *
 */
async function getMuseum(museumId) {
  try {
    return await Museum.findOne({ _id: museumId });
  } catch (error) {
    return false;
  }
}

module.exports = Object.freeze({ addMuseum, getAllMuseums, deleteMuseum , editMuseumProperty, getAllPublicMuseums,  getMuseum });
