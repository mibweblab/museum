import { Color } from "three";

function setupModel(data, material, name) {
  const model = data.scene;

  model.traverse(o => {
    if (material != undefined) {
      o.material = material;
    } else {
      if (o.isMesh) {
        o.geometry.computeVertexNormals();
        // o.material.reflectionTexture = null;
        // console.log(o.material.emissive)
        // o.material.emissive = new Color('white')
        // o.material.emissiveIntensity = 0
        // console.log(o.material.emissive)
        // o.material.emissive = 0xffffff
      }
    }

  });

  return model;
}

export { setupModel };
