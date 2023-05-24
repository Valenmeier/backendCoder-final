const socket = io();
const contenedor = document.querySelector(`.contenedorDeProductos`);

socket.on("datos", async (data) => {
  contenedor.innerHTML = "";
  await data.forEach((element) => {
    contenedor.innerHTML += ` <div >
    <a href="products/${element._id}" class="card">
        <div class="imagenCard">
            <img src="${element.thumbnail}" alt="${element.title}" srcset="">
        </div>
        <div class="tituloCard">
            <h3>${element.title}</h3>
        </div>
        <div class="cardHover">
            <div class="cardHoverTitle">
                <h3>${element.title}</h3>
            </div>
            <div class="cardHoverDescription">
                <h3>Descripción:</h3>
                <p> ${element.description}</p>
            </div>
            <div class="cardHoverPrice">
                 <div class="stockIdPrice">
                    <h3>Price = $${element.price}</h3>
                    <h3>Stock= ${element.stock}</h3>
                </div>
            </div>
        </div>
        </a>
    </div>`;
  });
});
