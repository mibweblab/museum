import React, { Component } from "react";
// import { World} from "../modules/RoomScenes/RoomScenes.js" ;  
import GPT3_Integrated from "./GPT3_Integrated.js";
import { Shakespeare, Einstein, Musk, UserUpload } from "../../HumanModel.js";
import { getIntro} from '../../LangModel.js'
import "./RoomScenes.css"
import Conversation from "./Conversation.js"
import ConversationAPI from  "../../api/conversation";
export default class Rooms extends Component{
  constructor(props) {
    super(props); 
    this.state = {
      isTextBoxVisible: "visible",
      conversation: [],
      question:[],
      imgUrl:undefined,
      modelFirstName: undefined,
      modelLastName: undefined,
      modelDescription: undefined,
    };
    this.getConversation()
  } 

  getConversation = async () => {
    const conversation = await ConversationAPI.getConversation(this.props.FrameId)
    const data = conversation.data
    this.setState({
      modelFirstName: data.firstName,
      modelLastName: data.lastName,
      modelDescription: data.description,
      imgUrl: data.frameUrl,
    }, ()=> { console.log(data); console.log(this.state)} )

  } 

  intro() {
    return getIntro(this.props.HumanModel)
  }

  onPrompt = async(promptText) => {
    const reactElArray = this.newlineText(promptText)
    this.setState({ question: reactElArray})

  }

  onResponse = async(responseText) => {
    const reactElArray = this.newlineText(responseText)

    this.setState((state) => 
    {
        // fix me

        const temp = state.conversation.concat(state.question)
        return { 
            conversation: temp.concat( reactElArray),
            question: "" 
        }
    })
  }

  newlineText = (res) => {
    const newText = res.split('\n').map(str => <p className='conversation-label'>{str}</p>);
    return newText;
  }
  
  render(){
      return(
        <div className='room-main'>
          {/* <div id="scene-container" ></div> */}
         <div className = 'main' id="scene-container">
          <Conversation HumanModel={this.props.HumanModel} FrameId={this.props.FrameId} FrameUrl={this.state.imgUrl}/>
         </div>
         <div id="sidebar"> 
          <div id='item1'>
            <p className='conversation-label'>{this.intro()} </p>
            {this.state.conversation}
            {this.state.question}
            <p></p>
          </div>
           {( (this.props.HumanModel != UserUpload) || (this.state.modelFirstName != undefined)) ?
           (<GPT3_Integrated FirstName={this.props.FirstName} HumanModel={this.props.HumanModel} visibility={this.state.isTextBoxVisible} onPrompt={this.onPrompt} onResponse={this.onResponse} modelFirstName={this.state.modelFirstName} modelLastName={this.state.modelLastName} modelDescription={this.state.modelDescription}/>)
           :  null}
         </div>
        
        </div>
      )
    }
  }

  
  
  
  
  
  
  

  

