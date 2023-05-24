export let actualizarPagina = (totalPages, accion, url) => {
  //* Función para traer el link de la página siguiente o anterior
  let urlActual = url;
  if (urlActual.includes("?") && urlActual.includes("&")) {
    let separarUrl = urlActual.split("?");
    let primeraParte = separarUrl[0];
    let segundaParte = separarUrl[1].split("&");
    let cambiarPag = segundaParte.map((element) => {
      if (element.includes("page=")) {
        let separarElement = element.split("=");
        let pagActual = Number(separarElement[1]);
        if (accion == "siguiente" && pagActual < totalPages) {
          pagActual = pagActual + 1;
        }
        if (accion == "anterior" && pagActual > 1) {
          pagActual = pagActual - 1;
        }
        if (accion == "ultimate" && pagActual < totalPages) {
          pagActual = totalPages;
        }
        if (accion == "first" && pagActual > 1) {
          pagActual = 1;
        }
        separarElement[1] = pagActual;
        return separarElement.join("=");
      }
      return element;
    });
    segundaParte = cambiarPag.join("&");
    let nuevoUrl = primeraParte + "?" + segundaParte;
    if (nuevoUrl !== urlActual) {
      return nuevoUrl;
    } else {
      return null;
    }
  } else if (urlActual.includes("?")) {
    let arregloUrl = urlActual + "&page=1";
    let separarUrl = arregloUrl.split("?");

    let primeraParte = separarUrl[0];
    let segundaParte = separarUrl[1].split("&");
    let cambiarPag = segundaParte.map((element) => {
      if (element.includes("page=")) {
        let separarElement = element.split("=");
        let pagActual = Number(separarElement[1]);
        if (accion == "siguiente" && pagActual < totalPages) {
          pagActual = pagActual + 1;
        }
        if (accion == "anterior" && pagActual > 1) {
          pagActual = pagActual - 1;
        }
        if (accion == "ultimate" && pagActual < totalPages) {
          pagActual = totalPages;
        }
        if (accion == "first" && pagActual > 1) {
          pagActual = 1;
        }
        separarElement[1] = pagActual;
        return separarElement.join("=");
      }
      return element;
    });
    segundaParte = cambiarPag.join("&");
    let nuevoUrl = primeraParte + "?" + segundaParte;
    if (nuevoUrl !== arregloUrl) {
      return nuevoUrl;
    } else {
      return null;
    }
  } else {
    let arregloUrl = urlActual + "?query=disponible&page=1";
    let separarUrl = arregloUrl.split("?");

    let primeraParte = separarUrl[0];
    let segundaParte = separarUrl[1].split("&");
    let cambiarPag = segundaParte.map((element) => {
      if (element.includes("page=")) {
        let separarElement = element.split("=");
        let pagActual = Number(separarElement[1]);
        if (accion == "siguiente" && pagActual < totalPages) {
          pagActual = pagActual + 1;
        }
        if (accion == "anterior" && pagActual > 1) {
          pagActual = pagActual - 1;
        }
        if (accion == "ultimate" && pagActual < totalPages) {
          pagActual = totalPages;
        }
        if (accion == "first" && pagActual > 1) {
          pagActual = 1;
        }
        separarElement[1] = pagActual;
        return separarElement.join("=");
      }
      return element;
    });
    segundaParte = cambiarPag.join("&");
    let nuevoUrl = primeraParte + "?" + segundaParte;
    
    if (nuevoUrl !== arregloUrl) {
      return nuevoUrl;
    } else {
      return null;
    }
  }
};
