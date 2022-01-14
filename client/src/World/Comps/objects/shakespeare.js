import {
    // BoxBufferGeometry,
    // MathUtils,
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
  } from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { setupModel } from './birds/setupModel.js';


  function createMaterial() {
    // create a texture loader.
    const textureLoader = new TextureLoader();
  
    // load a texture
    const texture = textureLoader.load('/shakespeare/textures/material0_baseColor.jpeg');
    // create a "standard" material using
    // the texture we just loaded as a color map
    const material = new MeshStandardMaterial({ map: texture});
  
    return material;
  }
  
  async function createShakespeare() {
    // create a geometry
    const loader = new GLTFLoader();
    let model;
    const [shakespeareData] = await Promise.all([
      loader.loadAsync('/shakespeare/scene.gltf',
)

    ]);
  
    console.log('Squaaawk!', shakespeareData);

    const material = createMaterial()
    const shakespeare = setupModel(shakespeareData, material);
    // shakespeare.position.set(0, 0, 32.5);
    // 
    // const fin = new Mesh(shakespeareData, material);
    return shakespeare;
  }
  
  export { createShakespeare };
  
  
  
  