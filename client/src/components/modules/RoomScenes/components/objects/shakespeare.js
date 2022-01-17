import {
  PlaneGeometry,
  MeshBasicMaterial,
  CylinderGeometry,
  MathUtils,
  Mesh,
  TextureLoader,
  DoubleSide,
  MeshPhongMaterial,
  Group,
  RepeatWrapping,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel.js';
import { createText } from './textObject.js'

function createShakespeareFloor() {
  let floorGeometry = new PlaneGeometry(1000, 1000, 10, 10);
  let floorTexture = new TextureLoader().load( '/shakespeareScene/floor.png' );
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
  floorTexture.repeat.set( 50, 50 );
  let floorMaterial = new MeshBasicMaterial( { map: floorTexture, side: DoubleSide } );

  let floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -4;

  return floor;
}

function createShakespeareCylinder() {
      
  let geometry = new CylinderGeometry(0.5, 1.2, 2);
  let floorTexture2 = new TextureLoader().load( '/shakespeareScene/floor.png' );

  let material = new MeshBasicMaterial({ color: 0xd1c9c9, map:floorTexture2, side: DoubleSide }); // 0xf2ce2e 
  let cylinder = new Mesh(geometry, material);

  cylinder.position.z = 15;
  cylinder.position.y = -2.9;
  cylinder.position.x = .5;

  return cylinder

}

async function createShakespeare() {
  let shakespeare_txt = new TextureLoader().load('/shakespeareScene/shakespeare2/textures/SouthwarkCathedralShakespeareTomb01_SouthwarkCathedralShakespeareTomb01_u1_v1_baseColor.jpeg');
  shakespeare_txt.flipY = false;
  const shakespeare_mtl = new MeshPhongMaterial({
    map: shakespeare_txt});

  let book_txt = new TextureLoader().load('/shakespeareScene/shakespeare_book/textures/material_0_diffuse.jpeg');
  book_txt.flipY = false;
  const book_mtl = new MeshPhongMaterial({
    map: book_txt});


  let window_txt = new TextureLoader().load('/shakespeareScene/window/textures/material_0_baseColor.jpeg');
  window_txt.flipY = false;
  const window_mtl = new MeshPhongMaterial({
    map: window_txt});  
  const loader = new GLTFLoader();
  
  const [shakespeareData, bookData, windowData] = await Promise.all([
    loader.loadAsync('/shakespeareScene/shakespeare2/scene.gltf'),
    loader.loadAsync('/shakespeareScene/shakespeare_book/scene.gltf'),
    loader.loadAsync('/shakespeareScene/window/scene.gltf'),
  ]);

  const shakespeare = setupModel(shakespeareData, shakespeare_mtl, "shakespeare");
  shakespeare.scale.set(.7, .7, .7)
  shakespeare.name = 'shakespeare'

  const book = setupModel(bookData, book_mtl, "book");
  book.scale.set(0.15, 0.15, 0.15)

  const window = setupModel(windowData, window_mtl, "window");
  window.scale.set(7, 7, 7)

  shakespeare.position.set(0, 3, 2.5);
  book.position.set(.5, 0, 14.5);
  window.position.set(-14, 14, 7.5)

  book.rotation.y = MathUtils.degToRad(-45);
  book.rotation.x = MathUtils.degToRad(-25);
  book.rotation.z = MathUtils.degToRad(-25);
  const radiansPerSecond = MathUtils.degToRad(30);
  let sign = 1

  book.tick = (delta) => {
    if (book.position.y >= 2) {
      sign = -1
    } else if (book.position.y <= -1.15) {
      sign = 1;
    }
    
    book.position.y += sign*delta * radiansPerSecond;
  };

  const floor = createShakespeareFloor()
  const cylinder = createShakespeareCylinder()
  const coordinates = {x: 0, y: 12.5, z:10}
  const text = await createText('A Shakespeare Read Aloud', coordinates, true, "/fonts/opt.json")

  const group = new Group();
  group.add(shakespeare)
  group.add(book)
  group.add(window)
  group.add(floor)
  group.add(cylinder)
  group.add(text)
  return {group, book};
}

export { createShakespeare };




