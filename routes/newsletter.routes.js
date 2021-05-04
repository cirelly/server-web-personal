const express = require('express');
const NewsletterController = require('../controllers/newsletter.controller');

const api = express.Router();

api.post("/suscribe-newsletter/:email", NewsletterController.suscribreEmail);

module.exports = api