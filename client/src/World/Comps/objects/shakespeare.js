import {
  // BoxBufferGeometry,
  // MathUtils,
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
  CylinderGeometry,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
  TextureLoader,
  ShapeGeometry,
  DoubleSide,
  BufferGeometry,
  MeshPhongMaterial,
  RepeatWrapping,
} from 'three';

import { FontLoader, Font} from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './birds/setupModel.js';

async function createShakespeareText() {
  const loader = new FontLoader();

  let mesh;
  console.log('test 1')
  const [font] = await Promise.all([
  loader.loadAsync( "/fonts/opt.json", function ( font )
  {
    
    return font

  })
])
  let xMid;

  let shapes = font.generateShapes( "A Shakespeare Read Aloud", 0.8);
  console.log(shapes)
  // let textShape = new BufferGeometry();
  let geometry = new ShapeGeometry( shapes );
  geometry.computeBoundingBox();

  let material = new MeshBasicMaterial( {
                                              color      : 0x000000,
                                              transparent: false,
                                              opacity    : 0.5,
                                              side       : DoubleSide
                                            } );
  
  xMid = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  geometry.translate( xMid, 0, 0 );

  // textShape.fromGeometry( geometry );
  mesh = new Mesh( geometry, material );
  mesh.position.set(0, 12.5, 10)

  return mesh
}

function createShakespeareFloor() {
  let floorGeometry = new PlaneGeometry(1000, 1000, 10, 10);
  let floorTexture = new TextureLoader().load( '/floor.png' );
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
  let floorTexture2 = new TextureLoader().load( '/floor.png' );

  let material = new MeshBasicMaterial({ color: 0xd1c9c9, map:floorTexture2, side: DoubleSide }); // 0xf2ce2e 
  let cylinder = new Mesh(geometry, material);

  cylinder.position.z = 15;
  cylinder.position.y = -2.9;
  cylinder.position.x = .5;

  return cylinder

}

async function createShakespeare() {
  // create a geometry

  let shakespeare_txt = new TextureLoader().load('/attempts/shakespeare2/textures/SouthwarkCathedralShakespeareTomb01_SouthwarkCathedralShakespeareTomb01_u1_v1_baseColor.jpeg');
  shakespeare_txt.flipY = false;
  const shakespeare_mtl = new MeshPhongMaterial({
    map: shakespeare_txt});

  let book_txt = new TextureLoader().load('/attempts/shakespeare_book/textures/material_0_diffuse.jpeg');
  book_txt.flipY = false;
  const book_mtl = new MeshPhongMaterial({
    map: book_txt});



  const loader = new GLTFLoader();
  
  const [shakespeareData, bookData] = await Promise.all([
    loader.loadAsync('/attempts/shakespeare2/scene.gltf'),
    loader.loadAsync('/attempts/shakespeare_book/scene.gltf')
  ]);

  const shakespeare = setupModel(shakespeareData, shakespeare_mtl, "shakespeare");
  shakespeare.scale.set(.7, .7, .7)
  shakespeare.name = 'shakespeare'

  const book = setupModel(bookData, book_mtl, "book");
  book.scale.set(0.15, 0.15, 0.15)


  shakespeare.position.set(0, 3, 2.5);
  book.position.set(.5, 0, 14.5);
  book.rotation.y = MathUtils.degToRad(-45);
  book.rotation.x = MathUtils.degToRad(-25);
  book.rotation.z = MathUtils.degToRad(-25);
  const radiansPerSecond = MathUtils.degToRad(30);
  let sign = 1

  // const group = new Group();
  // group.add(book);
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
  const text = await createShakespeareText()

  return {shakespeare, book, floor, cylinder, text};
}

export { createShakespeare };




