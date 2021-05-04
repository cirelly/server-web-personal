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

const getCourses = (req, res) => {
    Course.find()
        .sort({order: "asc"})
        .exec((err, courseStored)=> {
            if(err){
                res.status(500).send({code: 500, message: "Server Error."})
            }else if(!courseStored){
                res.status(404).send({code: 404, message: "Course is not found"})
            }else {
                res.status(200).send({code: 200, courses: courseStored})
            }
        })   
}
const deleteCourse = (req, res) => {
    const {id} = req.params;
    Course.findByIdAndRemove(id, (err, deletedCourse) => {
        if(err){
            res.status(500).send({code: 500, message: "Server Error."})
        }else if(!deletedCourse){
            res.status(404).send({code: 404, message: "Course not found."})
        }else{
            res.status(200).send({code:200, message:"Course deleted successfully."})
        }
    })
}

const updateCourse = (req, res) => {
    let courseData = req.body;
    const params = req.params;
    Course.findByIdAndUpdate(params.id, courseData, (err, courseUpdated)=> {
        if(err){
            res.status(500).send({code: 500, message:"Server Error."})
        } else if(!courseUpdated){
            res.status(404).send({code: 404, message: "Course not found."})
        }else {
            res.status(200).send({code: 200, message:"Course updated successfully."})
        }
    })
}

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse,

}