import { Vector3 } from 'three';

const Shakespeare = 0
const Einstein = 1
const Musk = 2
const UserUpload = 3

const HumanModels = [Shakespeare, Einstein, Musk, UserUpload]

const getCameraPosition = (humanModel, trialNum) => {
    switch(humanModel) {
        case Einstein:
            return (new Vector3(-20, 35, 50));
        case Shakespeare:
        case Musk:
            return (new Vector3(20, 35, 40));
        case UserUpload:
            return (new Vector3(10, 35, -80));
            
    }
}

const getFloorDir = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return '/conversation_assets/floors/shakespeare_floor.png'
        case Einstein:
        case Musk:
            return '/conversation_assets/floors/musk_floor.png'
        case UserUpload:
            return '/conversation_assets/floors/floor1.png'
        
    }
}

const getFigureSpecs = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return ({ 
                scale: [3, 3, 3],
                position: [-11.5, 20, -5],
                rotation: [0, Math.PI / 3, 0],
                figureDir: '/conversation_assets/shakespeare/scene.gltf'
            })
        case Einstein:
            return ({ 
                scale: [1.35, 1.35, 1.35],
                position: [40, 62, 22],
                rotation: [0,  -Math.PI / 2, 0],
                figureDir:'/conversation_assets/einstein2/scene.gltf'
            })
        case Musk:
            return ({ 
                scale: [35, 35, 35],
                position: [0, 20, 0],
                rotation: [0, 0, 0],
                figureDir:'/conversation_assets/elon_musk/scene.gltf'
            })
        case UserUpload:
            return '/conversation_assets/floors/floor1.png'
        
    }
}

export {Shakespeare, Einstein, Musk, UserUpload, HumanModels, getCameraPosition, getFloorDir, getFigureSpecs }