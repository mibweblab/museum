import React, { useState } from "react";
// import { World} from "../modules/RoomScenes/RoomScenes.js" ;  
import GPT3_Integrated from "./GPT3_Integrated.js";
import { Shakespeare, Einstein, Musk, UserUpload } from "../../HumanModel.js";
import { getIntro} from '../../LangModel.js'
import "./RoomScenes.css"
import Conversation from "./Conversation.js"
import ConversationAPI from  "../../api/conversation";

const Rooms = ({HumanModel, FirstName, LastName, FrameId }) => {
  const [conversation, setConversation] = useState([]);
  const [question, setQuestion] = useState([]);
  const [imgUrl, setImgUrl] = useState(undefined);
  const [modelFirstName, setModelFirstName] = useState(undefined);
  const [modelLastName, setModelLastName] = useState(undefined);
  const [modelDescription, setModelDescription] = useState(undefined);




  const getConversation = async () => {
    const conversation = await ConversationAPI.getConversation(FrameId)
    const data = conversation.data
    setModelFirstName(data.firstName)
    setModelLastName(data.lastName)
    setModelDescription(data.description)
    setImgUrl(data.frameUrl)
  } 

  if (HumanModel == UserUpload) {
    getConversation()
} 

  const intro = () => {
    return getIntro(HumanModel)
  }

  const onPrompt = async(promptText) => {
    const reactElArray = newlineText(promptText, true)
    setQuestion(reactElArray)
  }

  const onResponse = async(responseText, clearRequest) => {
    if (clearRequest) {
      setConversation([])
      setQuestion([])
    } else {
      const reactElArray = newlineText(responseText, false)
      const temp = conversation.concat(question)
      setConversation(temp.concat(reactElArray))
      setQuestion("")
    }
  }

  const getName = (isUser) => {
    if (isUser) {
      const firstName = (FirstName) ? FirstName : ""
      const lastName = (LastName) ? LastName : ""
      return firstName + " " + lastName
    } else {
      switch(HumanModel) {
          case Shakespeare:
              return "William Shakespeare"
          case Einstein:
              return "Albert Einstein"
          case Musk:
              return "Elon Musk"
          case UserUpload:
              return this.modelFirstName + " " + this.modelLastName // todo: receive upload info and replace
      }
    }
}

  const newlineText = (res, isPrompt) => {
    const className = isPrompt ? '-prompt' : '-response'
    const name = getName(isPrompt)
    const newText = res.split('\n').map(str => <p className={'conversation-label'}>{str}</p>);
    const paddedNewText = (
      <div className={'conversation' + className}>
        <label className={'Conversation-message-identifier'}>{name}</label>
        <div className={'conversation-container conversation-container'+className}>
          {newText}
        </div>
      </div>)
    return paddedNewText;
  }
  

  return(
    <div className='room-main'>
      {/* <div id="scene-container" ></div> */}
      <div className = 'main' id="scene-container">
      <Conversation HumanModel={HumanModel} FrameId={FrameId} FrameUrl={imgUrl}/>
      </div>
      <div id="sidebar"> 
      <div id='item1'>
        <h5 className='mt-0 conversation-label conversation-title'>{intro()} </h5>
        {conversation}
        {question}
        <p></p>
      </div>
        {( (HumanModel != UserUpload) || (modelFirstName != undefined)) ?
        (<GPT3_Integrated FirstName={FirstName} HumanModel={HumanModel} onPrompt={onPrompt} onResponse={onResponse} modelFirstName={modelFirstName} modelLastName={modelLastName} modelDescription={modelDescription}/>)
        :  null}
      </div>
    
    </div>
  )
    
  }

  
  export default Rooms;
  
  
  
  
  

  

