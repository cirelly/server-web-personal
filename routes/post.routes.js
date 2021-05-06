const express = require('express');

const postController = require('../controllers/post.controller');
const md_auth = require('../ middleware/authenticated');


const api = express.Router();


api.post('/add-post', [md_auth.ensureAuth], postController.addPost);
api.get('/get-post', postController.getPosts)
api.put('/update-post/:id', [md_auth.ensureAuth], postController.updatePost)
api.delete('/delete-post/:id', [md_auth.ensureAuth], postController.deletePost);
api.get('/get-post/:url', postController.getPost)

module.exports = api;