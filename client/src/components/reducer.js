
const pexel = (id) =>
`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const initialState = {
    frames :[{name: "Hello World", url:pexel(1103970),position: [0.8, 0, -0.6], rotation: [0, 0, 0] }],
    queuedFrame: null,
    isThereQueuedFrame: false,
}



const framesReducer = (state=initialState,action) => {

    switch(action.type){
        case "ADD_FRAME": 
         return {
            ...state,
            frames:[...state.frames,action.payload]
         };
        case "ADD_FRAME_TO_QUEUE":
            return {
                ...state,
                queuedFrame: action.payload     
            }
        case "DEQUEUE_FRAME":
            return {
                ...state,
                isThereQueuedFrame: action.payload
            }
            
        default: return state;  
    }
}

export default framesReducer;