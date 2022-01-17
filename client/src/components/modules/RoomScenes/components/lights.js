import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Vector2,
  SpotLight,
  SpotLightHelper,
  Group,
  Vector3,
  Object3D,
} from 'three';
import { Shakespeare, Einstein, Musk } from "../../../../LangModel.js"


function createLights(humanModel) {
  // const ambientLight2 = new AmbientLight('white', 2);

  const ambientLight = new HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
     0.4, // intensity
  );

  let d = 8.25;
  const mainLight = new DirectionalLight('white', 1.5);
  mainLight.position.set(10, 10, 10);
  // mainLight.castShadow = true;
  // mainLight.shadow.mapSize = new Vector2(1024, 1024);
  // mainLight.shadow.camera.near = 10;
  // mainLight.shadow.camera.far = 1500;
  // mainLight.shadow.camera.left = d * -1;
  // mainLight.shadow.camera.right = d;
  // mainLight.shadow.camera.top = d;
  // mainLight.shadow.camera.bottom = d * -1;

  let group3 = new Group()
  group3.add(ambientLight)
  group3.add(mainLight)
  // group3.add(ambientLight2)

  // todo: move this functionality
  const spotLight = new SpotLight( 0xffffff, 2 );
  switch (humanModel) {
    case Shakespeare:
      spotLight.position.set( -2, 0, 22.5 );
      spotLight.angle = 0.9;
      spotLight.penumbra = 0;
      spotLight.decay = 1;
      spotLight.distance = 200;
      spotLight.power = 20
      spotLight.target.position.set(2, 5, 0)
      group3.add(spotLight)
      break
    case Einstein:
      spotLight.position.set( 0, 0, 0 );
      spotLight.angle = 0.9;
      spotLight.penumbra = 0;
      spotLight.decay = 1;
      spotLight.distance = 200;
      spotLight.power = 0
      spotLight.target.position.set(0, 0, 10)
      group3.add(spotLight)
      break
    case Musk:
      break
  }





  const lightHelper = new SpotLightHelper( spotLight );
  group3.add(lightHelper)
  

  
  return { spotLight, group3 }

}

export { createLights };
