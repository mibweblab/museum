import { Vector3 } from 'three';

const Shakespeare = 0
const Einstein = 1
const Musk = 2

const HumanModels = [Shakespeare, Einstein, Musk]

const getCameraPosition = (humanModel, trialNum) => {
    switch(humanModel) {
        case Shakespeare:
            return (new Vector3(0, 5, 50))
        case Einstein:
            if (trialNum == 0) { return (new Vector3(250, 300, 800)) }
            else { return (new Vector3(0, 5, 50)) }
        case Musk:
            return `man`
        
    }
}

class LangModelAttributes {
    constructor(humanModel, optionalFirstName) {
        this.humanModel = humanModel


        this.firstName = this.defaultFirstName(humanModel, optionalFirstName)
        console.log('make way')
        console.log(this.firstName)
    }

    humanModelName = () => {
        switch(this.humanModel) {
            case Shakespeare:
                return "William Shakespeare"
            case Einstein:
                return "Albert Einstein"
            case Musk:
                return "Elon Musk"
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

        }
    }

    polishedInput = (inputVal) => {
        switch(this.humanModel) {
            case Shakespeare:
                return inputVal
            case Einstein:
            case Musk:
                return (`\n${this.firstName}: ` + inputVal)
        }
    }

    stop = () => {
        switch(this.humanModel) {
            case Shakespeare:
                return (['###', '\nShakespeare:', '##', '/nTopic:'])
            case Einstein:
            case Musk:
                return [`\n${this.firstName}:`, `${this.firstName}:`]
        }
    }

    modelPayload = (maxTokens, combinedPrompts) => {
        switch(this.humanModel) {
            case Shakespeare:
                return ({
                    engine:"davinci",
                    prompt: combinedPrompts,
                    maxTokens: maxTokens,
                    temperature: 0.5,
                    n: 1,
                    stop: this.stop(),
                    top_p: 1,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.27
                });
            case Einstein:
            case Musk:
                return ({
                    engine:"davinci",
                    prompt: combinedPrompts,
                    maxTokens: maxTokens,
                    temperature: 0.5,
                    n: 1,
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
                return `Conversation with ${this.humanModelName()}`
        } 
    }

}

export {Shakespeare, Einstein, Musk, HumanModels, LangModelAttributes, getCameraPosition }