import { PerspectiveCamera } from 'three';

function createCamera(width, height) {

    const fov = 35;
    const aspect = width / height;
    const near = 0.1
    const far = 100

    
    let camera = new PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    )


    // move the camera back so we can view the scene
    camera.position.set(0, 0, 10);

    return camera;
}

export { createCamera };
