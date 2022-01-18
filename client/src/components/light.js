import { DirectionalLight, PointLight, RectAreaLight,  AmbientLight,HemisphereLight} from "three";


function createLights(type) {
  // Create a directional light

  let light;
  const ambientLight = new AmbientLight('white', 2);

  if (type === "point") {
    light = new PointLight("white", 100);
    light.position.set(20, 20, 20);
  } else if (type === "rect") {
    light = new RectAreaLight("white", 1, 100);
    light.position.set(50, 50, 50);
  } else {
    light = new DirectionalLight("brown", 8);
    // move the light right, up, and towards us
    light.position.set(10, 10, 10);
  }
  return {light,ambientLight};
}

export { createLights };
