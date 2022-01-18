import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  // // start the loop
  // renderer.setAnimationLoop(() => {
  //   renderer.render(scene, camera);
  // });
  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
