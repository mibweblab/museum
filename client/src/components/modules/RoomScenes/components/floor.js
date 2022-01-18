import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    DoubleSide,
    RepeatWrapping,
  } from 'three';

function createFloor(floorDir) {
    let floorGeometry = new PlaneGeometry(1000, 1000, 10, 10);
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
  
export { createFloor };
