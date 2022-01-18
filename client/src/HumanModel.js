
const Shakespeare = 0
const Einstein = 1
const Musk = 2
const UserUpload = 3

const HumanModels = [Shakespeare, Einstein, Musk, UserUpload]

const getCameraPosition = (humanModel, trialNum) => {
    switch(humanModel) {
        case Shakespeare:
            return (new Vector3(0, 5, 50))
        case Einstein:
            if (trialNum == 0) { return (new Vector3(250, 300, 800)) }
            else { return (new Vector3(0, 5, 50)) }
        case Musk:
            return `man`
        case UserUpload:
            return (new Vector3(0, 5, 50))
        
    }
}

const getFloorDir = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return '/floor.png'
        case Einstein:
            return '/einstein_floor.png'
        case Musk:
            return '/musk_floor.png'
        case UserUpload:
            return '/einsteinScene1/floor/floor1.png'
        
    }
}

export {Shakespeare, Einstein, Musk, UserUpload, HumanModels, getCameraPosition, getFloorDir }