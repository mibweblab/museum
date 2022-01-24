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

const addInitialMuseums = (payload) => ({
  type: "ADD_INITIAL_MUSEUMS",
  payload: payload,
});

const addMuseum = (payload) => ({
  type: "ADD_MUSEUM",
  payload: payload,
});

const changeTransformMode = (payload) => ({
  type: "CHANGE_TRANSFORM_MODE",
  payload: payload,
});
const addFrameToTransform = (payload) => ({
  type: "ADD_FRAME_TO_TRANSFORM",
  payload: payload,
});

const addCurrentMuseum = (payload) => ({
  type: "ADD_CURRENT_MUSEUM",
  payload: payload,
});

const addCurrentFrame = (payload) => ({
  type: "ADD_CURRENT_FRAME",
  payload: payload,
});

const addCurrentImage = (payload) => ({
  type: "ADD_CURRENT_IMAGE",
  payload: payload,
});

const editCurrentFrame = (payload) => ({
  type: "EDIT_CURRENT_FRAME",
  payload: payload,
});

export {
  addFrame,
  addFrameToQueue,
  dequeueFrame,
  addInitialFrames,
  addMuseum,
  addInitialMuseums,
  changeTransformMode,
  addFrameToTransform,
  addCurrentMuseum,
  addCurrentFrame,
  addCurrentImage,
  editCurrentFrame
};
