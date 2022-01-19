
const pexel = (id) =>
`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const initialState = {
    frames :[],
    moveObject: null,
    queuedFrame: null,
    isThereQueuedFrame: false,
    grassCubes: [],
    trees: [],
    towers: [],
    fencePieces: [],
    fenceMiddles: [],
    fenceCorners: [],
    bridges: [],
    queuedObject: null,
    rotateObject: null,
    translateObject: null,
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
        
        case "ADD_INITIAL_FRAMES":
            return {
                ...state,
                frames: action.payload
            }

        case "ADD_MOVE_OBJECT":
            return {
                ...state,
                moveObject: action.payload
            }
            
        case "ADD_GRASS_CUBE":
            return {
                ...state,
                grassCubes: [...state.grassCubes,action.payload]
            } 
        case "ADD_TREE":
                return {
                    ...state,
                    trees: [...state.trees,action.payload]
        } 
        case "ADD_OBJECT_TO_QUEUE":
            return {
                ...state,
                queuedObject: action.payload
            } 
        case "ADD_BRIDGE":
            return {
                ...state,
                bridges: [...state.bridges,action.payload]
            } 
        case "ADD_TOWER":
            return {
                ...state,
                towers: [...state.towers,action.payload]
            } 
        case "ADD_FENCE_PIECE":
            return {
                ...state,
                fencePieces: [...state.fencePieces,action.payload]
            } 
        case "ADD_FENCE_CORNER":
            return {
                ...state,
                fenceCorners: [...state.fenceCorners,action.payload ]
            } 
        case "ADD_FENCE_MIDDLE":
            return {
                ...state,
                fenceMiddles: [...state.fenceMiddles,action.payload ]
            } 

        case "QUEUE_TRANSLATE":
            return {
                ...state,
                translateObject: action.payload
            } 
        case "QUEUE_ROTATE":
            return {
                ...state,
                rotateObject: action.payload 
            } 
        default: return state;  
    }
}

export default framesReducer;