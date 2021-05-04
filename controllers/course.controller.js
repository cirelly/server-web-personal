const express = require('express');
const Course = require('../models/course.models')


 const addCourse = (req, res) => {
    const body = req.body;
    const course = new Course(body);
    
    course.order=1000;
    course.save((err, courseStored) => {
        if(err){
            res.status(400).send({code: 400, message: "Course already exist."})
        }else if(!courseStored){
            res.status(400).send({code: 400, message: "Course is not created."})
        }else{
            res.status(200).send({code: 200, message:"Course created successfully."})
        }
    })
} 


module.exports = {
    addCourse,

}