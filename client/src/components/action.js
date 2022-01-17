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


const dequeueFrame= (payload) => ({
    type: "DEQUEUE_FRAME",
    payload: payload,
  });

export { addFrame, addFrameToQueue, dequeueFrame };
