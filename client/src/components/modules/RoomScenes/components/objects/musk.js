import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    DoubleSide,
    Group,
    RepeatWrapping,
    BoxGeometry,
    Color
  } from 'three';
  
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { setupModel } from './setupModel.js';
  import { getFloorDir, Musk} from '../../../../../HumanModel.js'
  import { createFloor} from '../floor.js'

  
  async function createMusk() {

    let txt = new TextureLoader().load('/anim.png');
    let txt2 = new TextureLoader().load('/frame.png');

    const loader = new GLTFLoader();

    const [muskData] = await Promise.all([
      loader.loadAsync('/elon_musk/scene.gltf'),

    ]);
  
    const musk = setupModel(muskData, undefined, "musk");
    musk.scale.set(35, 35, 35)
    

  
    const floor = createFloor(getFloorDir(Musk))
    const geometry = new BoxGeometry( 16, 24, 1 );
    const geometry2 = new BoxGeometry( 20, 28, 1 );
    const material = new MeshBasicMaterial( {map: txt} );
  
    const color = new Color('pink')
    const color2 = new Color('red')

    const geometry3 = new BoxGeometry( 2, 28, 1 );


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

    musk.position.set(0, y, 0)
    // musk.rotation.y = Math.PI / 3
    cube.position.set(0, y, 0)
    cube2.position.set(0, y, 1)
    cube3.position.set(9, y, 0)
    cube4.position.set(-9, y, 0)
    cube5.position.set(0, y + 13, 0)
    cube6.position.set(0, y -13, 0)

    const group = new Group();

    // group.add(cube)
    // group.add(cube2)
    group.add(cube3)
    group.add(cube4)
    group.add(cube5)
    group.add(cube6)

    let sign = 4
 
    console.log(group.position)
    group.tick = (delta) => {
    if (group.position.y >= 5) {
      sign = -4
    } else if (group.position.y <= -1.15) {
      sign = 4;
    }
    
    group.position.y += sign*delta;
    };

    const muskGroup = new Group();
    muskGroup.add(group)
    muskGroup.add(floor)
    muskGroup.add(musk)

    return {muskGroup};
  }
  
  export { createMusk };

  
  
  
  