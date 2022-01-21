import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import GPT3 from "./GPT3_playground";

const Speech = (props) => {
  //   const [value, setValue] = React.useState("");
  const { speak } = useSpeechSynthesis();
  console.log(props);
  return (
    <div className="speech">
      <div className="group">
        <h3> Text to Speech </h3>
      </div>
      <div className="group">
        <textarea
          rows="10"
          value={props.response}

          //   onChange={(e) => setValue(e.target.value)}
        >
          {props.response}
        </textarea>
      </div>
      <div className="group">
        <button className="speechbutton" onClick={() => speak({ text: props.response })}>
          Speech {console.log(props.response)}
        </button>
      </div>
    </div>
  );
};

export default Speech;
