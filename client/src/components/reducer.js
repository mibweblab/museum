const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const initialState = {
  frames: [],
  queuedFrame: null,
  isThereQueuedFrame: false,
  museums: [],
  frameToTransform: "",
  mode: "",
  currentImage: null,
  currentFrame: null,
  currentMuseum: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FRAME":
      return {
        ...state,
        frames: [...state.frames, action.payload],
      };
    case "ADD_FRAME_TO_QUEUE":
      return {
        ...state,
        queuedFrame: action.payload,
      };
    case "DEQUEUE_FRAME":
      return {
        ...state,
        isThereQueuedFrame: action.payload,
      };

    case "ADD_INITIAL_MUSEUMS":
      return {
        ...state,
        museums: action.payload,
      };
    case "ADD_INITIAL_FRAMES":
      return {
        ...state,
        frames: action.payload,
      };
    case "ADD_MUSEUM":
      return {
        ...state,
        museums: [...state.museums, action.payload],
      };

    case "CHANGE_TRANSFORM_MODE":
      return {
        ...state,
        mode: action.payload,
      };

    case "ADD_FRAME_TO_TRANSFORM":
      return {
        ...state,
        frameToTransform: action.payload,
      };

    case "ADD_CURRENT_MUSEUM":
      return {
        ...state,
        currentMuseum: action.payload,
      };
    case "ADD_CURRENT_FRAME":
      return {
        ...state,
        currentFrame: action.payload,
      };
    case "ADD_CURRENT_IMAGE":
      return {
        ...state,
        currentImage: action.payload,
      };

    case "EDIT_CURRENT_FRAME":
      let { id, name, text } = action.payload;
      let frames = state.frames.filter((f) => f._id === id);
      let isolatedFrames = state.frames.filter((f) => f._id !== id);

      if (frames.length > 0) {
        let frame = frames[0];
        frame.name = name;
        frame.text = text;
      }
      let combinedFrames = isolatedFrames.concat(frames);
      return { ...state, frames: combinedFrames };

    case "DELETE_CURRENT_FRAME":
      let frameId = action.payload;
      let filteredFrames = state.frames.filter((f) => f._id !== frameId);
      return { ...state, frames: filteredFrames };
    
    case "DELETE_MUSEUM": 
       let museumId = action.payload;
       let filteredMuseums = state.museums.filter((m)=> m._id !== museumId);
       return {...state, museums: filteredMuseums}
    default:
      return state;
  }
};

export default reducer;
