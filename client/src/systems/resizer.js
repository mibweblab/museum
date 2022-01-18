const setSize = (container, camera, renderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);
    //   // start the loop
    // renderer.setAnimationLoop(() => {
    //   renderer.render(scene, camera);
    // });
      // update the camera's frustum
    camera.updateProjectionMatrix();

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
};


class Resizer {
constructor(container, camera, renderer) {
  // set initial size on load
  setSize(container, camera, renderer);
  window.addEventListener('resize', () => {
    // set the size again if a resize occurs
    setSize(container, camera, renderer);
    this.onResize()
  });
}

onResize() {}
}

export {Resizer}