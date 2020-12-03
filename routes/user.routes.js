const express = require('express');
const UserController = require('../controllers/user.controllers')
const md_auth = require('../ middleware/authenticated')
const api = express.Router();
const multiparty = require('connect-multiparty');

const md_upload_avatar = multiparty({uploadDir: "./uploads/avatar"})

api.post("/signup", UserController.signUp);
api.post("/signin", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.get('/users-active', [md_auth.ensureAuth], UserController.getUsersActive);
api.put('/upload-avatar/:id', [md_auth.ensureAuth, md_upload_avatar], UserController.uploadAvatar);

module.exports = api;