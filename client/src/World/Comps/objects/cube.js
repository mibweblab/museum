import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from 'three';

// client/src/public/box.png
// /Users/Julia/museum/client/src/assets/textures/box.png
function createMaterial() {
  // create a texture loader.
  const textureLoader = new TextureLoader();

  // load a texture
  const texture = textureLoader.load('/colored_box.png');
  // create a "standard" material using
  // the texture we just loaded as a color map
  const material = new MeshStandardMaterial({ map: texture});

  return material;
}

function createCube() {
  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = createMaterial()

  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);
  const radiansPerSecond = MathUtils.degToRad(30);

  // this method will be called once per frame
  cube.tick = (delta) => {
    // increase the cube's rotation each frame
    cube.rotation.z += radiansPerSecond * delta;
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
  }; 
  return cube;
}

export { createCube };



