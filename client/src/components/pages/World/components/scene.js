import { Color, Scene, Fog } from 'three';

function createScene() {
  const scene = new Scene();
  const backgroundColor = 'black';
  scene.background = new Color(backgroundColor);
  scene.fog = new Fog(backgroundColor, 60, 100);

  return scene;
}

export { createScene };
