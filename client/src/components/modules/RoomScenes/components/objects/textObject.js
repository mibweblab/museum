import {
    MeshBasicMaterial,

    Mesh,

    ShapeGeometry,
    DoubleSide,

  } from 'three';
  
  import { FontLoader, Font} from 'three/examples/jsm/loaders/FontLoader.js';

  async function createText(text, coordinates, alignCenter, fontString) {
    const loader = new FontLoader();
  

    let mesh;
    const [font] = await Promise.all([
    loader.loadAsync( fontString, function ( font )
    {
      
      return font
  
    })
  ])
    let xMid;
  
    let shapes = font.generateShapes( text, 0.8);
    console.log(shapes)
    // let textShape = new BufferGeometry();
    let geometry = new ShapeGeometry( shapes );
    geometry.computeBoundingBox();
  
    let material = new MeshBasicMaterial( {
                                                color      : 0x000000,
                                                transparent: false,
                                                opacity    : 0.5,
                                                side       : DoubleSide
                                              } );
    
    xMid = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    if (alignCenter) {
      geometry.translate( xMid, 0, 0 );
    }

    mesh = new Mesh( geometry, material );
    console.log(coordinates)
                                              
    mesh.position.set(coordinates.x, coordinates.y, coordinates.z)
  
    return mesh
  }
  

  
  export { createText };
  
  
  
  
  