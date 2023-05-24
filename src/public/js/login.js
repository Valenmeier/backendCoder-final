let contraseña = document.querySelector(`.contraseña`);
let mostrarContraseña = document.querySelector(`.mostrarContraseña`);
let botonConfirmar=document.querySelector(`.confirmarIngreso`)


mostrarContraseña.addEventListener(`click`, () => {
  if (contraseña.type == "password") {
    mostrarContraseña.innerHTML="Ocultar contraseña"
    contraseña.type = "text";
  }else if (contraseña.type == "text") {
    mostrarContraseña.innerHTML="Mostrar contraseña"
    contraseña.type = "password";
  }
});

botonConfirmar.addEventListener("click",()=>{
  contraseña.type = "password";
})