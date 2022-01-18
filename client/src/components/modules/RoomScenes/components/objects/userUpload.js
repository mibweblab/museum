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
  import { createText } from './textObject'
  import { getFloorDir, UserUpload} from '../../../../../HumanModel.js'
  import { createFloor, createDoor} from '../sharedObjects.js'
  

  
  async function createUserUpload() {

    let txt = new TextureLoader().load('/anim.png');
    let txt2 = new TextureLoader().load('/frame.png');

    const loader = new GLTFLoader();

    const door = await createDoor(true)
    const floor = createFloor(getFloorDir(UserUpload))
    const geometryImage = new BoxGeometry( 16, 24, 1 );
    const geometryFrameBacking = new BoxGeometry( 20, 28, 1 );
    
    const imageMaterial = new MeshBasicMaterial( {map: txt} );
  
    const color = new Color('dark green')

    const geometryFrameLong = new BoxGeometry( 2, 28, 1 );
    const geometryFrameShort = new BoxGeometry( 16, 2, 1 );

    const frameMaterial = new MeshBasicMaterial( {color:  color, map: txt2} );
    
    const imageMesh = new Mesh( geometryImage, imageMaterial );

    const frameBack = new Mesh( geometryFrameBacking, frameMaterial );
    const frameSide0 = new Mesh( geometryFrameLong, frameMaterial );
    const frameSide1 = new Mesh( geometryFrameLong, frameMaterial );
    const frameSide2 = new Mesh( geometryFrameShort, frameMaterial );
    const frameSide3 = new Mesh( geometryFrameShort, frameMaterial );

    let y = 20

    imageMesh.position.set(0, y, 0)
    frameBack.position.set(0, y, 1)
    frameSide0.position.set(9, y, 0)
    frameSide1.position.set(-9, y, 0)
    frameSide2.position.set(0, y + 13, 0)
    frameSide3.position.set(0, y -13, 0)

    const UUMovableGroup = new Group();
    UUMovableGroup.add(imageMesh)
    UUMovableGroup.add(frameBack)
    UUMovableGroup.add(frameSide0)
    UUMovableGroup.add(frameSide1)
    UUMovableGroup.add(frameSide2)
    UUMovableGroup.add(frameSide3)

    let sign = 4
    UUMovableGroup.tick = (delta) => {
    if (UUMovableGroup.position.y >= 5) {
      sign = -4
    } else if (UUMovableGroup.position.y <= -1.15) {
      sign = 4;
    }
    UUMovableGroup.position.y += sign*delta;
    };

    const userUploadGroup = new Group();
    userUploadGroup.add(UUMovableGroup)
    userUploadGroup.add(floor)
    userUploadGroup.add(door)

    return { userUploadGroup, UUMovableGroup };
  }
  
  export { createUserUpload };
  
  
  
  
  