import { UsersModel } from "./dao/mongodb/usersModel.js";

export class UsersServices {
  constructor() {
    this.userModel = new UsersModel();
  }
  createUser = (user) => {
    return this.userModel.createUser(user);
  };
  searchUser = (email) => {
    return this.userModel.searchUser(email);
  };
  searchUserById = (id) => {
    return this.userModel.searchUserById(id);
  };
  updateUser = (email, nuevaInformacion) => {
    return this.userModel.updateUser(email, nuevaInformacion);
  };
  updateUserWithId = (id, nuevaInformacion) => {
    return this.userModel.updateUserWithId(id, nuevaInformacion);
  };
  searchUserByCartId = (id) => {
    return this.userModel.searchUserByCartId(id);
  };
  addDocument = (uid, documents) => {
    return this.userModel.addDocument(uid, documents);
  };

  getAllProfiles = () => {
    return this.userModel.getAllProfiles();
  };
  deleteInactiveUsers = () => {
    return this.userModel.deleteInactiveUsers();
  };
  getRolWithEmail = (email) => {
    return this.userModel.getRolWithEmail(email);
  };
  deleteUser = (email) => {
    return this.userModel.deleteUser(email);
  };
}
