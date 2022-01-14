import {
    // BoxBufferGeometry,
    // MathUtils,
    PlaneGeometry,
    MeshBasicMaterial,
    CylinderGeometry,
    
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
    DoubleSide,
    ImageUtils,
    MeshPhongMaterial,
    RepeatWrapping,
  } from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { setupModel } from './birds/setupModel.js';


  function createMaterial() {
    // create a texture loader.
    // const textureLoader = new TextureLoader();
  
    // load a texture
    // const texture = textureLoader.load('/material0_baseColor.jpeg');
    // create a "standard" material using
    // the texture we just loaded as a color map
    // const material = new MeshStandardMaterial({ map: texture});
  
    // return material;
  }
  
  async function createShakespeare() {
    // create a geometry

    let stacy_txt = new TextureLoader().load('/attempts/shakespeare/textures/material0_baseColor.jpeg');
    stacy_txt.flipY = false;

    const stacy_mtl = new MeshPhongMaterial({
      map: stacy_txt});
      // color: 0xffffff,
      
      // skinning: true


    const loader = new GLTFLoader();
    
    const [shakespeareData] = await Promise.all([
      loader.loadAsync('/attempts/shakespeare/scene.gltf',
)

    ]);
  
    console.log('Squaaawk!', shakespeareData);

    
    const shakespeare = setupModel(shakespeareData, stacy_mtl);
    shakespeare.scale.set(.7, .7, .7)
    // , .7, .7);
    shakespeare.position.set(0, 0, 0);



	
	// var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	// floor.position.y = -0.5;
	// floor.rotation.x = Math.PI / 2;


        // Floor
    
    let floorGeometry = new PlaneGeometry(1000, 1000, 10, 10);
    let floorTexture = new TextureLoader().load( '/floor.png' );
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; 
    floorTexture.repeat.set( 50, 50 );
    let floorMaterial = new MeshBasicMaterial( { map: floorTexture, side: DoubleSide } );


    let floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -4;
    
    let geometry = new CylinderGeometry(0.5, 1.2, 2);
    let floorTexture2 = new TextureLoader().load( '/floor.png' );

    let material = new MeshBasicMaterial({ color: 0xd1c9c9, map:floorTexture2, side: DoubleSide }); // 0xf2ce2e 
    let sphere = new Mesh(geometry, material);

    sphere.position.z = 3.1;
    sphere.position.y = -2.9;
    sphere.position.x = .5;


    return {shakespeare, floor, sphere};
  }
  
  export { createShakespeare };
  
  
  
  