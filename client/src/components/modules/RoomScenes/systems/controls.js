import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  controls.enableDamping = true;

  controls.listenToKeyEvents( window ); // optional

	controls.dampingFactor = 0.5;

  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 100;
 
	controls.maxPolarAngle = Math.PI / 2;
  controls.tick = () => {
    controls.update();


  }

  return controls;
}

export { createControls };
