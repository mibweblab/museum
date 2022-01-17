function setupModel(data, material, name) {
  const model = data.scene;

  model.traverse(o => {
    if (material != undefined) {
      o.material = material;
    }
  });

  return model;
}

export { setupModel };
