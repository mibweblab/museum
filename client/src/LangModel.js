import { Vector3 } from 'three';
import { Shakespeare, Einstein, Musk, UserUpload } from './HumanModel.js';

const getIntro = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return "Please tell me a topic, and I shall read you something from my works."
        case Einstein:
            return "Welcome to Einstein's room. Feel free to start a conversation"
        case Musk:
            return "Welcome to Musk's room. Feel free to start a conversation"
        case UserUpload:
            return "Welcome to your uploaded room. Feel free to start a conversation" // todo: receive upload info and replace
    }
}

const getTextAreaDescription = (humanModel) => {
    switch(humanModel) {
        case Shakespeare:
            return "Receive Shakespeare&#x27;s writings on any topic."
        case Einstein:
            return "Converse with Einstein"
        case Musk:
            return "Chat with Elon."
        case UserUpload:
            return "Chat with your uploaded figure." // todo: receive upload info and replace
    }
}


class LangModelAttributes {
    constructor(humanModel, optionalFirstName, modelFirstName, modelLastName, modelDescription) {
        this.humanModel = humanModel
        this.firstName = this.defaultFirstName(humanModel, optionalFirstName)
        this.modelFirstName= modelFirstName
        this.modelLastName = modelLastName
        this.modelDescription = modelDescription
    }

    humanModelName = () => {
        switch(this.humanModel) {
            case Shakespeare:
                return "William Shakespeare"
            case Einstein:
                return "Albert Einstein"
            case Musk:
                return "Elon Musk"
            case UserUpload:
                return "User Uploaded Person" // todo: receive upload info and replace
        }
    }



    defaultFirstName = (humanModel, firstName) => {
        if (firstName != undefined) { return firstName }
        else { 
            switch(humanModel) {
                case Shakespeare:
                    return undefined
                case Einstein:
                    return `Interviewer`
                case Musk:
                    return `man`
                case UserUpload:
                    return 'Interviewer' // todo: find less formal word
            }
        }
    }

    
    staticPrompt = (optionalTopic) => {
        switch(this.humanModel) {
            case Shakespeare:
                let topic = (optionalTopic) ? optionalTopic : `Rage`
                return (`Topic: Youth\nShakespeare:\nMy glass shall not persuade me I am old,\nSo long as youth and thou are of one date;\nBut when in thee time’s furrows I behold,\nThen look I death my days should expiate.\n###\nTopic: ${optionalTopic} \nShakespeare:`)
            case Einstein:
                return `The following is a transcript of a conversation between ${this.firstName} and Albert Einstein. Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics (alongside quantum mechanics). His work is also known for its influence on the philosophy of science. He is best known to the general public for his mass–energy equivalence formula E = mc2, which has been dubbed “the world’s most famous equation”. He received the 1921 Nobel Prize in Physics “for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect”, a pivotal step in the development of quantum theory. \n${this.firstName}:Hello, Mr. Einstein.\nAlbert Einstein: Hello, ${this.firstName}.`;
            case Musk:
                return `The following is a transcript of a conversation between ${this.firstName} and Elon Musk. Elon Mus is a visionary entrepreneur. He is the charismatic co-founder of PayPal and Tesla, as well as the founder of SpaceX, Neuralink, and The Boring Company. He serves as CEO of Tesla and CEO/lead engineer of SpaceX.\n${this.firstName}:Hello, Mr. Musk. \nMusk: Hey ${this.firstName}.`
            case UserUpload:
                return `The following is a transcript of a conversation between ${this.firstName} and ${this.modelFirstName} ${this.modelLastName}. ${this.modelDescription} \n${this.firstName}:Hello, ${this.modelFirstName} ${this.modelLastName}. \n${this.modelLastName}: Hey ${this.firstName}.`

        }
    }

    polishedInput = (inputVal) => {
        switch(this.humanModel) {
            case Shakespeare:
                return inputVal
            case Einstein:
            case Musk:
            case UserUpload:
                return (`\n${this.firstName}: ` + inputVal)
        }
    }

    stop = () => {
        switch(this.humanModel) {
            case Shakespeare:
                return (['###', '\nShakespeare:', '##', '/nTopic:'])
            case Einstein:
            case Musk:
            case UserUpload:
                return [`\n${this.firstName}:`, `${this.firstName}:`]
        }
    }

    modelPayload = (maxTokens, combinedPrompts) => {
        switch(this.humanModel) {
            case Shakespeare:
                return ({
                    prompt: combinedPrompts,
                    max_tokens: maxTokens,
                    temperature: 0.5,
                    // n: 1,
                    stop: this.stop(),
                    top_p: 1,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.27
                });
            case Einstein:
            case Musk:
            case UserUpload:
                return ({
                    prompt: combinedPrompts,
                    max_tokens: maxTokens,
                    temperature: 0.5,
                    // n: 1,
                    stop: this.stop(),
                    top_p: 1,
                    frequency_penalty: 0.61,
                    presence_penalty: 0.24
                });
        }
        
    }

    title () {
        switch(this.humanModel) {
            case Shakespeare:
                return 'Shakespeare Read Aloud on your Desired Topic'
            case Einstein:
            case Musk:
            case UserUpload:
                return `Conversation with ${this.humanModelName()}`
        } 
    }

}

export {LangModelAttributes, getIntro, getTextAreaDescription }