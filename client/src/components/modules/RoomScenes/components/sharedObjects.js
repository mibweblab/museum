import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    DoubleSide,
    RepeatWrapping,
  } from 'three';
  import { setupModel } from  './objects/setupModel.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function createFloor(floorDir) {
    let floorGeometry = new PlaneGeometry(150, 150, 5, 5);
    let floorTexture = new TextureLoader().load(floorDir);
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    let floorMaterial = new MeshBasicMaterial( { map: floorTexture, side: DoubleSide } );
  
    let floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -4;
  
    return floor;
  }
  
async function createDoor(userUpload) {

  const loader = new GLTFLoader();

  const [doorData] = await Promise.all([
    loader.loadAsync('/wooden_door/scene.gltf'),
  ]);

  const door = setupModel(doorData, undefined, "door");
  door.scale.set(6, 6, 6)
  

  if (userUpload) {
    door.rotation.y = Math.PI / 2
    door.position.set(-30, 12, 75)
  } else {
    door.rotation.y = -Math.PI / 2
    door.position.set(30, 12, -75)
  }


  return door;
}
export { createFloor, createDoor };
