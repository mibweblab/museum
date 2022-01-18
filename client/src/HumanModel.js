import { Vector3 } from 'three';

const Shakespeare = 0
const Einstein = 1
const Musk = 2
const UserUpload = 3

const HumanModels = [Shakespeare, Einstein, Musk, UserUpload]

const getCameraPosition = (humanModel, trialNum) => {
    switch(humanModel) {
        case Einstein:
            return (new Vector3(-20, 35, 80));
        case Shakespeare:
        case Musk:
            return (new Vector3(20, 35, 80));
        case UserUpload:
            return (new Vector3(10, 5, -50));
            
    }
}

const getFloorDir = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return '/floors/shakespeare_floor.png'
        case Einstein:
            return '/floors/einstein_floor.png'
        case Musk:
            return '/floors/musk_floor.png'
        case UserUpload:
            return '/floors/floor1.png'
        
    }
}

export {Shakespeare, Einstein, Musk, UserUpload, HumanModels, getCameraPosition, getFloorDir }