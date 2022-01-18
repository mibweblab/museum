import { Color } from "three";

function setupModel(data, material, name) {
  const model = data.scene;

  model.traverse(o => {
    if (material != undefined) {
      o.material = material;
    } else {
      if (o.isMesh) {
        o.geometry.computeVertexNormals();
      }
    }

  });

  return model;
}

export { setupModel };
