import { MessagesServices } from "./messageService.js";


export class MessagesController {
  constructor() {
    this.MessagesService = new MessagesServices();
  }
  getMessages=()=>{
    return this.MessagesService.getMessages()
  }
  createMessages=(data)=>{
    return this.MessagesService.createMessages(data)
  }
}
