import { TicketServices } from "./ticketServices.js";

export class TicketController {
  constructor() {
    this.ticketService = new TicketServices();
  }
  createTicket = (data) => {
    let { email, amount } = data;

    if (email && amount) {
      let data = {
        purchaser: email,
        amount,
        code: new Date().valueOf() + Math.random() * 10000,
        // Aquí convierto la cadena de texto a un objeto Date
        purchase_datatime: new Date(),
      };
      return this.ticketService.createTicket(data);
    } else {
      return {
        status: 400,
        response: "Completa todos los campos",
      };
    }
  };

  searchTicket = (ticket) => {
    return this.ticketService.searchTicket(ticket);
  };
  searchTicketById = (id) => {
    return this.ticketService.searchTicketById(id);
  };
}
