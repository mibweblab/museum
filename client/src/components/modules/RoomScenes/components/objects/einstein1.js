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
  
  function createEinsteinFloor() {
    let floorGeometry = new PlaneGeometry(1000, 1000, 10, 10);
    let floorTexture = new TextureLoader().load( '/einsteinScene1/floor/floor0.png' );
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    let floorMaterial = new MeshBasicMaterial( { map: floorTexture, side: DoubleSide } );
  
    let floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -4;
  
    return floor;
  }
  

  
  async function createEinstein() {
    let desk_txt0 = new TextureLoader().load('/einsteinScene1/desk/textures/material_0_baseColor.png');
    let desk_txt1 = new TextureLoader().load('/einsteinScene1/desk/textures/material_0_metallicRoughness.png');
    let desk_txt2 = new TextureLoader().load('/einsteinScene1/desk/textures/material_0_normal.png');
    desk_txt0.flipY = false;
    desk_txt1.flipY = false;
    desk_txt2.flipY = false;
    const desk_mtl = new MeshPhongMaterial({
      map: desk_txt0, toneMapped:desk_txt2, bumpMap:desk_txt1});
  
    // let chair_txt = new TextureLoader().load('/einsteinScene1/chair/textures/material_0_diffuse.jpeg');
    // book_txt.flipY = false;
    // const book_mtl = new MeshPhongMaterial({
    //   map: book_txt});
  
  
    // let window_txt = new TextureLoader().load('/shakespeareScene/window/textures/material_0_baseColor.jpeg');
    // window_txt.flipY = false;
    // const window_mtl = new MeshPhongMaterial({
    //   map: window_txt});  
    const loader = new GLTFLoader();
    
    const [deskData, chairData, shelfData] = await Promise.all([
      loader.loadAsync('/einsteinScene1/desk/scene.gltf'),
      loader.loadAsync('/einsteinScene1/chair/scene.gltf'),
      loader.loadAsync('/einsteinScene1/shelf/scene.gltf'),
    //   loader.loadAsync('/einsteinScene1/chalkboard/scene.gltf'),
    ]);
  
    const desk = setupModel(deskData, desk_mtl, "desk");
    desk.scale.set(15, 15, 15)
    desk.name = 'desk'
  
    // const book = setupModel(bookData, book_mtl, "book");
    // book.scale.set(0.15, 0.15, 0.15)
  
    const chair = setupModel(chairData, undefined, "window");
    chair.scale.set(15, 15, 15)
  
    desk.position.set(0, 3, 0);
    chair.position.set(0, 3, 3)
    // book.position.set(.5, 0, 14.5);
    // window.position.set(0, 14, 14.5)
  
    // book.rotation.y = MathUtils.degToRad(-45);
    // book.rotation.x = MathUtils.degToRad(-25);
    // book.rotation.z = MathUtils.degToRad(-25);
    // const radiansPerSecond = MathUtils.degToRad(30);
    // let sign = 1
  
    // book.tick = (delta) => {
    //   if (book.position.y >= 2) {
    //     sign = -1
    //   } else if (book.position.y <= -1.15) {
    //     sign = 1;
    //   }
      
    //   book.position.y += sign*delta * radiansPerSecond;
    // };
  
    const floor = createEinsteinFloor()
    // const cylinder = createShakespeareCylinder()
    // const coordinates = {x: 0, y: 12.5, z:10}
    // const text = await createText('A Shakespeare Read Aloud', coordinates, true, "/fonts/opt.json")
  
    const group2 = new Group();
    group2.add(desk)
    group2.add(chair)
    // group.add(window)
    group2.add(floor)
    // group.add(cylinder)
    // group.add(text)
    return {group2};
  }
  
  export { createEinstein };
  
  
  
  
  