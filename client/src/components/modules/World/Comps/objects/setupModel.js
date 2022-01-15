function setupModel(data, material, name) {
  const model = data.scene;
  console.log(model)

  model.traverse(o => {
    o.material = material;
    o.name = name   
  });

  return model;
}

export { setupModel };
