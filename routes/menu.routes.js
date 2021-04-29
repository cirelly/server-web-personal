const express = require('express');
const MenuController = require('../controllers/menu.controller');
const md_auth = require('../ middleware/authenticated');

const api = express.Router();

api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);
api.get("/get-menus", MenuController.getMenus);
api.put("/update-menu/:id", [md_auth.ensureAuth], MenuController.updateMenuOrder)
api.put('/activate-menu/:id',[md_auth.ensureAuth], MenuController.activateMenu)
api.delete("/delete-menu/:id", [md_auth.ensureAuth], MenuController.deleteMenu)

module.exports = api;
