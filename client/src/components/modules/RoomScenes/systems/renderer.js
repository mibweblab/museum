import { WebGLRenderer , sRGBEncoding} from 'three';

function createRenderer(width, height) {
  const renderer = new WebGLRenderer({ antialias: true });
  
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.physicallyCorrectLights = false;
  renderer.outputEncoding = sRGBEncoding;
  return renderer;

}

export { createRenderer };
