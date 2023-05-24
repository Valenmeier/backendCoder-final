export class DataUserDTO {
  constructor(data) {
    (this.user = data.user),
      (this.email = data.email),
      (this.rol = data.rol),
      (this.cart = data.cart),
      (this.online = data.online),
      (this.lastConnection = data.last_connection);
    this.userId = data._id;
  }
}
