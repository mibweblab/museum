import React, { Suspense, useRef } from 'react'
import { useGLTF,  } from '@react-three/drei'

// onClick = (e) => {
//   this.props.navigate('/')
//   // let mouse = {};
//   // mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
//   // mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  
//   //   // update the picking ray with the camera and mouse position
//   // this.raycaster.setFromCamera(mouse, this.camera);

//   //   // calculate objects intersecting the picking ray
//   // var intersects = this.raycaster.intersectObjects(this.scene.children, true);

//   // if (intersects[0]) {
//   //   let object = intersects[0].object;
//   //   const doorClicked = (object.parent.name === 'door') 
//   //   if (doorClicked) {
      
//   //   }

    
//   // }

// }

export default function Door(props) {
  const gltf = useGLTF('/wooden_door/scene.gltf')
  return (

      <primitive  object={gltf.scene} {...props} onClick={() => props.navigate('/')}/>
    
  )
}

useGLTF.preload('/wooden_door/scene.gltf')