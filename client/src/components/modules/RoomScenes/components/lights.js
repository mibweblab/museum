import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Vector2
} from 'three';

function createLights() {
  const ambientLight2 = new AmbientLight('white', 2);

  const ambientLight = new HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
     0.5, // intensity
  );

  let d = 8.25;
  const mainLight = new DirectionalLight('white', .5);
  mainLight.position.set(4, 10, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize = new Vector2(1024, 1024);
  mainLight.shadow.camera.near = 10;
  mainLight.shadow.camera.far = 1500;
  mainLight.shadow.camera.left = d * -1;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = d * -1;

  return { ambientLight, mainLight, ambientLight2}

}

export { createLights };
