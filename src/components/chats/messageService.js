import { MessagesModel } from "./dao/mongodb/messagesModel.js";

export class MessagesServices {
    constructor() {
      this.MessagesModel = new MessagesModel();
    }
    getMessages=()=>{
      return this.MessagesModel.getMessages()
    }
    createMessages=(data)=>{
        return this.MessagesModel.createMessage(data)
    }
  }