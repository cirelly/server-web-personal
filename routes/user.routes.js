const express = require("express");
const UserController = require("../controllers/user.controllers");
const md_auth = require("../ middleware/authenticated");
const api = express.Router();
const multiparty = require("connect-multiparty");
const userControllers = require("../controllers/user.controllers");

const md_upload_avatar = multiparty({ uploadDir: "./uploads/avatar" });

api.post("/signup", UserController.signUp);
api.post("/signin", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id", [md_auth.ensureAuth], UserController.updateUser )
api.put("/activate-user/:id",[md_auth.ensureAuth], UserController.activateUser )
api.delete("/delete-user/:id", [md_auth.ensureAuth], UserController.deleteUser )
api.post("/create-user", [md_auth.ensureAuth], UserController.createUser )
module.exports = api;
