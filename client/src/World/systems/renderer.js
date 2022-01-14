import { WebGLRenderer } from 'three';

function createRenderer(width, height) {
  const renderer = new WebGLRenderer({ antialias: true });
  
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.physicallyCorrectLights = true;
  
  return renderer;

}

export { createRenderer };