const express = require('express');
const AuthController = require('../controllers/auth.controller');

const api = express.Router();

api.post('/refresh-access-token', AuthController.refreshAccessToken);


module.exports = api;