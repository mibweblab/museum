import { PerspectiveCamera } from 'three';

function createCamera(width, height) {

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

  
  

    // move the camera back so we can view the scene
    camera.position.set(0, 5, 50);

    return camera;
}

export { createCamera };
