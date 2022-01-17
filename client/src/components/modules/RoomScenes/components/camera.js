import { PerspectiveCamera } from 'three';

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

    camera.position.set(10, 5, -50);


    return camera;
}

export { createCamera };
