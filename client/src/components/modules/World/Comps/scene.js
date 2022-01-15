import { Color, Scene, Fog } from 'three';

function createScene() {
  const scene = new Scene();
  const backgroundColor = 0xf1f1f1;
  scene.background = new Color(backgroundColor);
  scene.fog = new Fog(backgroundColor, 60, 100);

  return scene;
}

export { createScene };
