import * as React from "react";
import { JustifiedInfiniteGrid } from "@egjs/react-infinitegrid";

function getItems(nextGroupKey, count) {
  const nextItems = [];
  const nextKey = nextGroupKey * count;

  for (let i = 0; i < count; ++i) {
    nextItems.push({ groupKey: nextGroupKey, key: nextKey + i });
  }
  return nextItems;
}

const Item = ({ num }) => <div className="item" style={{
  width: "250px",
}}>
  <div className="thumbnail">
    <img
      src={`https://naver.github.io/egjs-infinitegrid/assets/image/${(num % 33) + 1}.jpg`}
      alt="egjs" data-grid-maintained-target="true"
    />
  </div>
  <div className="info">{`egjs ${num}`}</div>
</div>;

export default function App() {
  const [items, setItems] = React.useState(() => getItems(0, 5));

  return <JustifiedInfiniteGrid
    className="container"
    gap={5}
    onRequestAppend={(e) => {
      // console.log(e.groupKey)
      const nextGroupKey = (e.groupKey || 0) + 1;

      setItems([
        ...items,
        ...getItems(nextGroupKey, 5),
      ]);
    }}
  >
    {items.map((item) => <Item data-grid-groupkey={item.groupKey} key={item.key} num={item.key} />)}
  </JustifiedInfiniteGrid>;
}


// const MuseumCard = ({
//   imageUrl,
//   name,
//   description,
//   _id,
//   isPrivate,
//   userImageUrl,
//   userObject,
//   navigate,
//   isCurrentUser,
// }) => {
//   return (
//     <>
//       <div className="Card">
//         {/* {(isCurrentUser) && <Button id="card__button_cta" onClick={() => navigate(`/museum/`+ _id)}>Edit </Button>}
//           <Button id="card__button" >Visit</Button> */}
//         <img src={imageUrl} className="Card-image" />
//         <div className="Card-overlay">
//           <div className="Card-header">
//             <div className="Card-details">
//               <span className="Card-title">{name}</span>
//               <span className="Card-time">1 hour ago</span>
//               {isPrivate && <span className="Card-status">Private</span>}
//             </div>
//           </div>
//           <div className="Card-footer">
//             <p class="card__description Card-description">{description}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };