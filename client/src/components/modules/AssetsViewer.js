import React from "react";

import FencePiece from "./nature/Fence1";
import FenceMiddle from "./nature/FenceMiddle";
import FenceCorner from "./nature/FenceCorner";
import Tower from "./nature/Tower";
import Bridge from "./nature/Bridge";

function FenceMiddles({fenceMiddles}) {
    return (
      <group
      >
        {fenceMiddles.map(
          (props,index) => <FenceMiddle key={index + '-fenceMiddle' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
        )}
      </group>
    );
}

function FenceCorners({fenceCorners}) {
    return (
      <group
      >
        {fenceCorners.map(
          (props,index) => <FenceCorner key={index + '-fenceMiddle' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
        )}
      </group>
    );
}

function FencePieces({fencePieces}) {
    return (
      <group
      >
        {fencePieces.map(
          (props,index) => <FencePiece key={index + '-fencePieces' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
        )}
      </group>
    );
}


function Towers({towers}) {
  return (
    <group
    >
      {towers.map(
        (props,index) => <Tower scale={0.5} key={index + '-fencePieces' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
      )}
    </group>
  );
}

function Bridges({bridges}) {
  return (
    <group
    >
      {bridges.map(
        (props,index) => <Bridge key={index + '-fencePieces' } position={props.position} rotation={props.rotation}  /> /* prettier-ignore */
      )}
    </group>
  );
}

export {FenceCorners, FenceMiddles, FencePieces, Bridges, Towers}
