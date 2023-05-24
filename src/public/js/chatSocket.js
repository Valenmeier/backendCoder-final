const socket = io();

//* usuario
let usuario;
//*  Cargar los mensajes
let mensajes;
socket.on("messages", (allMessages) => {
  mensajes = allMessages;
  mostrarMensajes(usuario);
});

let mostrarMensajes = (user) => {
  usuario = user;
  let contenedorDeMensajes = document.querySelector(
    ".contenedorFlexibleMensajes"
  );
  contenedorDeMensajes.innerHTML = "";
  for (let mensaje of mensajes) {
    if (mensaje.user == usuario) {
      contenedorDeMensajes.innerHTML += `<div class="nuevoMensaje mensajePropio">
        <span class="usuarioMsg">${mensaje.user}:</span>
        <div class="mensajeEnviado">${mensaje.message}</div>
        </div>`;
    } else {
      contenedorDeMensajes.innerHTML += `<div class="nuevoMensaje mensajeAjeno">
        <span class="usuarioMsg">${mensaje.user}:</span>
        <div class="mensajeEnviado">${mensaje.message}</div>
        </div>`;
    }
  }
};

Swal.fire({
  title: "Coloca tu nombre de usuario",
  input: "text",
  inputValidator: (value) => {
    return !value && `Necesita un nombre`;
  },
  allowOutsideClick: false,
}).then((person) => {
  Swal.fire("Bienvenido " + person.value).then((res) => {
    mostrarMensajes(person.value);
  });
});

//* Evitar que el formulario reinicie la pag
const form = document.querySelector(`.contenedorEnviarMensajes`);
form.addEventListener(`submit`, (e) => {
  e.preventDefault();
});

//* Enviar msg

const textarea = document.querySelector("textarea");
let subirDatosDB=(event) => {
    if (event.key == `Enter`) {
      event.preventDefault();
      textarea.style.height = `0`;
      let scHeight = event.target.scrollHeight;
      textarea.style.height = `${scHeight}px`;
      if (textarea.value.trim().length > 0) {
        let nuevoMensaje = { user: usuario, message: textarea.value };
        socket.emit("newMessage", nuevoMensaje);
  
        textarea.value = "";
      }
    }
  }
textarea.addEventListener(`keydown`,subirDatosDB );
const botonEnviarMSG=document.querySelector(".escribirMsg")
botonEnviarMSG.addEventListener(`keydown`,subirDatosDB );


//*Resize textarea

textarea.addEventListener("keydown", (e) => {
  textarea.style.height = `0`;
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});
textarea.addEventListener("keyup", (e) => {
  textarea.style.height = `0`;
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});
