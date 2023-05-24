import { TicketsModel } from "./dao/mongodb/ticketModel.js";

export class TicketServices {
  constructor() {
    this.ticketModel = new TicketsModel();
  }
  createTicket = (ticket) => {
    return this.ticketModel.createTicket(ticket);
  };
  searchTicket = (email) => {
    return this.ticketModel.searchTicket(email);
  };
  searchTicketById = (id) => {
    return this.ticketModel.searchTicketById(id);
  };
}
