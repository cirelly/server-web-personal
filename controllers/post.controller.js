const e = require('express');
const  Post = require('../models/post.models');

const addPost = (req, res) => {
    const body = req.body;
    const post = new Post(body);

    post.save((err, postStored)=> {
        if(err){
            res.status(500).send({ code: 500, message: "Server Error."})
        }else if(!postStored){
            res.status(400).send({code: 400, message: "Can not created the post."})
        }else{
            res.status(200).send({code: 200, message:"Post created successfully."})
        }
    })
}


const getPosts= (req, res) => {
    const {page=1, limit=10} = req.query
    const options ={
        page,
        limit: parseInt(limit),
        sort: {date: "desc"}
    }
    Post.paginate({}, options, (err, postStored) => {
        if(err){
            res.status(500).send({ code: 500, message: "Server Error."})
        } else if(!postStored){
            res.status(404).send({code: 404, message: "Post not found."})
        }else{
            res.status(200).send({code: 200, posts: postStored})
        }
    }) 
}

const updatePost = (req, res) => {
    const data = req.body;
    const {id} = req.params;
    Post.findByIdAndUpdate(id, data, (err, postUpdated) => {
        if(err){
            res.status(500).send({code:500, message: "Server Error."})
        }else if(!postUpdated){
            res.status(404).send({code:404, message: "Post not found."})
        }else{
            res.status(200).send({code: 200, message: "Post updated successfully."})
        }
    })
}
const deletePost = (req, res) => {
    const {id} = req.params;
    Post.findByIdAndRemove(id, (err, postDeleted) => {
        if(err){
            res.status(500).send({code: 500, message: "Server Error."})
        }else if(!postDeleted){
            res.status(404).send({code: 404, message:"Post not found."})
        }else{
            res.status(200).send({code: 200, message: "Post deleted succesfully"})
        }
    })
}

const getPost = (req, res) => {
    const {url} = req.params;
    Post.findOne({url}, (err, postStored) => {
        if(err){
            res.status(500).send({code: 500, message:"Server Error."})
        }else if(!postStored){
            res.status(404).send({code: 404, message:"Post not found"})
        }else{
            res.status(200).send({code: 200, post: postStored})
        }
    })

}
module.exports = {

    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
}