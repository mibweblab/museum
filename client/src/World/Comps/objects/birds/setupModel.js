import { AnimationMixer } from 'three';

function setupModel(data, material) {
  const model = data.scene;
  // model = shakespeareData.scene
  console.log(model)
  // const material = createMaterial()
  model.traverse(o => {

    // console.log('traversing')
    o.material = material
    o.castShadow = true;
    o.receiveShadow = true;
  });
  // const clip = data.animations[0];

  // const mixer = new AnimationMixer(model);
  // const action = mixer.clipAction(clip);
  // action.play();

  // model.tick = (delta) => mixer.update(delta);
  

  return model;
}

export { setupModel };
