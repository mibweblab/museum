import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.tick = () => controls.update();
  controls.target.set(1,2,3);
  return controls;
}

export { createControls };
