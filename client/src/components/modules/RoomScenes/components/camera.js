import { PerspectiveCamera } from 'three';
import { getCameraPosition } from './../../../../HumanModel.js'

function createCamera(width, height, humanModel) {

    const fov = 50;
    const aspect = width / height;
    const near = 0.1
    const far = 1000

    
    let camera = new PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    )

    const coordinates = getCameraPosition(humanModel)
    camera.position.set(coordinates.x, coordinates.y, coordinates.z);


    return camera;
}

export { createCamera };
