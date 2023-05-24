import { Server } from "socket.io";
import dotenv from "dotenv";
import { MessagesController } from "../components/chats/messageController.js";

dotenv.config();
const port = process.env.PORT || 8080 || 3000;

export let socketServer = (app) => {
  const httpServer = app.listen(port, () => {
    console.log(`servidor escuchando en el puerto 8080`);
  });
  const io = new Server(httpServer, {
    cors: {
      origin: `${process.env.FRONT_DOMAIN}`,
      methods: ["GET", "POST"],
    },
  });
  io.on(`connection`, async (socket) => {
    let messagesController = new MessagesController();
    fetch(`${process.env.DOMAIN_NAME}/api/products`)
      .then((data) => data.json())
      .then((res) => res.payload || res)
      .then((datos) => {
        socket.emit(`datos`, datos);
      });
    socket.emit("messages", await messagesController.getMessages());
    socket.on("newMessage", async (data) => {
      await messagesController.createMessages(data);
      io.emit("messages", await messagesController.getMessages());
    });
  });
};
