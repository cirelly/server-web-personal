const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const jwt = require("../services/jwt");
const fs = require('fs');
const path = require('path')
signUp = async (req, res) => {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;
  //Validate password and repeatPassword request
  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Password required." });
  } else {
    // password is match?
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Password do not match." });
    } else {
      try {
        const hash = await bcrypt.hash(password, 10);
        // hashing user password
        user.password = hash;

        // Save at database MONGODB ATLAS
        // userStored contains user object
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "User already exist." });
          } else {
            if (!userStored) {
              res.status(404).send({ message: "Error at created user." });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } catch (error) {
        res.status(500).send({ message: "Server error." });
      }
    }
    // res.status(200).send({message: "User created."})
  }
};

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Server error." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "User not found." });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Server error." });
          } else if (!check) {
            res.status(404).send({ message: "Password do not match." });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: "User is not actived." });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res){
  User.find().then(users => {
    if(!users){
      res.status(404).send({
        message: "No Users Found."
      })
    } else {
      res.status(200).send({users})
    }
  })
}
function getUsersActive(req, res){
  const query = req.query;
  User.find({active: query.active}).then(users => {
    if(!users){
      res.status(404).send({
        message: "No Users Found."
      })
    } else {
      res.status(200).send({users})
    }
  })
}

function uploadAvatar(req, res){
  const params = req.params;
  User.findById({ _id: params.id}, (err, userData) => {
    if(err){
      res.status(500).send({
        message: "Server Error."
      })
    }else {
      if(!userData){
        res.status(404).send({

          message: "User not found."
        })
      }else {
        let user = userData;
        console.log(user);
        console.log(req.files);
      }
    }
  })
}
module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar
};
