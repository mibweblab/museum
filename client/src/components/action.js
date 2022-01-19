const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const addFrame = (payload) => ({
  type: "ADD_FRAME",
  payload: payload,
});

const addFrameToQueue = (payload) => ({
  type: "ADD_FRAME_TO_QUEUE",
  payload: payload,
});

const dequeueFrame = (payload) => ({
  type: "DEQUEUE_FRAME",
  payload: payload,
});

const addInitialFrames = (payload) => ({
  type: "ADD_INITIAL_FRAMES",
  payload: payload,
});

const addMoveObject = (payload) => ({
  type: "ADD_MOVE_OBJECT",
  payload: payload,
});

const addGrassCube = (payload) => ({
  type: "ADD_GRASS_CUBE",
  payload: payload,
});

const addTree= (payload) => ({
  type: "ADD_TREE",
  payload: payload,
});

const addObjectToQueue = (payload) => ({
  type: "ADD_OBJECT_TO_QUEUE",
  payload: payload,
});



// const addFrameToQueue = (payload) => ({
//   type: "ADD_FRAME_TO_QUEUE",
//   payload: payload,
// });

// const dequeueFrame = (payload) => ({
//   type: "DEQUEUE_FRAME",
//   payload: payload,
// });

const addObjectToTransformQueue = (payload) => (payload);

const addObject= (data) =>(data)

export { addFrame, addFrameToQueue, dequeueFrame, addInitialFrames, addMoveObject, addObjectToQueue, addGrassCube, addTree, addObject,addObjectToTransformQueue };
