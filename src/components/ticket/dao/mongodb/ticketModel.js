import mongoose from "mongoose";
import { ticketSchema } from "./ticketSchema.js";

const ticketCollection = "tickets";

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export class TicketsModel {
  constructor() {
    this.ticket = ticketModel;
  }
  createTicket = async (ticket) => {
    return {
      status: 200,
      response: await this.ticket.create(ticket),
    };
  };
  searchTicket = async (ticket) => {
    return await this.ticket.findOne({ email: ticket });
  };
  searchTicketById = async (id) => {
    return await this.ticket.findById(id);
  };
}
