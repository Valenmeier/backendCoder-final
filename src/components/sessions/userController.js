import { UsersServices } from "./userServices.js";

export class UserController {
  constructor() {
    this.userService = new UsersServices();
  }
  createUser = (user) => {
    return this.userService.createUser(user);
  };
  searchUser = (email) => {
    return this.userService.searchUser(email);
  };
  searchUserById = (id) => {
    return this.userService.searchUserById(id);
  };
  updateUser = (email, nuevaInformacion) => {
    return this.userService.updateUser(email, nuevaInformacion);
  };
  updateUserWithId = (id, nuevaInformacion) => {
    return this.userService.updateUserWithId(id, nuevaInformacion);
  };
  searchUserByCartId = (id) => {
    return this.userService.searchUserByCartId(id);
  };
  addDocument = (uid, documents) => {
    return this.userService.addDocument(uid, documents);
  };
  getAllProfiles = () => {
    return this.userService.getAllProfiles();
  };
  deleteInactiveUsers = () => {
    return this.userService.deleteInactiveUsers();
  };
  getRolWithEmail = (email) => {
    return this.userService.getRolWithEmail(email);
  };
  deleteUser = (email) => {
    return this.userService.deleteUser(email);
  };
}
