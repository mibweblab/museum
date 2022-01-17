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
    BoxGeometry,
    Color
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
    // let desk_txt0 = new TextureLoader().load('/einsteinScene1/desk/textures/material_0_baseColor.png');
    // let desk_txt1 = new TextureLoader().load('/einsteinScene1/desk/textures/material_0_metallicRoughness.png');
    let txt = new TextureLoader().load('/anim.png');
    let txt2 = new TextureLoader().load('/framme.png');
    // desk_txt0.flipY = false;
    // desk_txt1.flipY = false;
    // desk_txt2.flipY = false;
    // const desk_mtl = new MeshPhongMaterial({
    //   map: desk_txt0, toneMapped:desk_txt2, bumpMap:desk_txt1});
  
    // let chair_txt = new TextureLoader().load('/einsteinScene1/chair/textures/material_0_diffuse.jpeg');
    // book_txt.flipY = false;
    // const book_mtl = new MeshPhongMaterial({
    //   map: book_txt});
  
  
    // let window_txt = new TextureLoader().load('/shakespeareScene/window/textures/material_0_baseColor.jpeg');
    // window_txt.flipY = false;
    // const window_mtl = new MeshPhongMaterial({
    //   map: window_txt});  
    const loader = new GLTFLoader();
    
    // const [deskData, chairData, shelfData, shelfData2, chalkboardData] = await Promise.all([
    //   loader.loadAsync('/einsteinScene1/desk/scene.gltf'),
    //   loader.loadAsync('/einsteinScene1/chair/scene.gltf'),
    //   loader.loadAsync('/einsteinScene1/shelf/scene.gltf'),
    //   loader.loadAsync('/einsteinScene1/shelf/scene.gltf'),
    //   loader.loadAsync('/einsteinScene1/chalkboard/scene.gltf'),
    // ]);
  
    // const desk = setupModel(deskData, undefined, "desk");
    // desk.scale.set(15, 15, 15)
    // desk.name = 'desk'
  
    // const chalkboard = setupModel(chalkboardData, undefined, "chalkboard");
    // chalkboard.scale.set(5, 5, 5)
  
    // const chair = setupModel(chairData, undefined, "chair");
    // chair.scale.set(10, 10, 10)
  
    // const shelf = setupModel(shelfData, undefined, "window");
    // shelf.scale.set(10, 10, 10)


    // const shelf2 = setupModel(shelfData2, undefined, "window");

    // desk.position.set(0, 2, 0);
    // chair.position.set(15, 4, 20)
    // shelf.position.set(17, -3, 50)
    // shelf2.position.set(-17, -3, 50)
    // chalkboard.position.set(0, -3, 42)
    // chalkboard.rotation.y = Math.PI
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
    const geometry = new BoxGeometry( 16, 24, 1 );
    const geometry2 = new BoxGeometry( 20, 28, 1 );
    const material = new MeshBasicMaterial( {map: txt} );
  
    const color = new Color('pink')
    const color2 = new Color('red')

    const geometry3 = new BoxGeometry( 2, 28, 1 );
    // const geometry4 = new BoxGeometry( 2, 28, 1 );

    const geometry4 = new BoxGeometry( 16, 2, 1 );


    const material1 = new MeshBasicMaterial( {color:  color, map: txt2} );
    const material2 = new MeshBasicMaterial( {color:  color2, map: txt2} );
    
    const cube = new Mesh( geometry, material );
    const cube2 = new Mesh( geometry2, material1 );
    const cube3 = new Mesh( geometry3, material2 );
    const cube4 = new Mesh( geometry3, material2 );

    let y = 20

    const cube5 = new Mesh( geometry4, material2 );
    const cube6 = new Mesh( geometry4, material2 );
    cube.position.set(0, y, 0)
    cube2.position.set(0, y, 1)
    cube3.position.set(9, y, 0)
    cube4.position.set(-9, y, 0)
    cube5.position.set(0, y + 13, 0)
    cube6.position.set(0, y -13, 0)
    // const cylinder = createShakespeareCylinder()
    // const coordinates = {x: 0, y: 12.5, z:10}
    // const text = await createText('A Shakespeare Read Aloud', coordinates, true, "/fonts/opt.json")
  
    
    // group2.add(desk)
    // // group2.add(chair)
    // // group2.add(shelf)
    // // group2.add(shelf2)
    const group1 = new Group();

    group1.add(cube)
    group1.add(cube2)
    group1.add(cube3)
    group1.add(cube4)
    group1.add(cube5)
    group1.add(cube6)

    let sign = 4
 
    console.log(group1.position)
    group1.tick = (delta) => {
    if (group1.position.y >= 5) {
      sign = -4
    } else if (group1.position.y <= -1.15) {
      sign = 4;
    }
    
    group1.position.y += sign*delta;
    };

    const group2 = new Group();
    group2.add(group1)
    group2.add(floor)

    return {group2, group1};
  }
  
  export { createEinstein };
  
  
  
  
  