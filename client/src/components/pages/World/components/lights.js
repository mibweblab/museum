import {
    Vector2,
    DirectionalLight,
    HemisphereLight,
  } from 'three';
  
  function createLights() {
    // const ambientLight = new AmbientLight('white', 2);
  
    // Add lights
    let hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);


    let d = 8.25;
    let dirLight = new DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;

  
    return { hemiLight, dirLight };
  }
  
  export { createLights };
  