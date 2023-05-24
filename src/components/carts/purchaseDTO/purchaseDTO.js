export class PurchaseDTO {
  constructor(data, token) {
    (this.email = data.email),
      (this.cart = data.cart),
      (this.rol = data.rol),
      (this.token = token);
  }
}
