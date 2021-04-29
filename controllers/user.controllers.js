const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const jwt = require("../services/jwt");
const fs = require("fs");
const path = require("path");

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

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({
        message: "No Users Found.",
      });
    } else {
      res.status(200).send({ users });
    }
  });
}
function getUsersActive(req, res) {
  const query = req.query;
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({
        message: "No Users Found.",
      });
    } else {
      res.status(200).send({ users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;
  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({
        message: "Server Error.",
      });
    } else {
      if (!userData) {
        res.status(404).send({
          message: "User not found.",
        });
      } else {
        let user = userData;
        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split("/");
          let fileName = fileSplit[2];
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "Invalid extention image. Only accept PNG & JPG extentions.",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userReslult) => {
                if (err) {
                  res.status(500).send({ message: "Server error." });
                } else {
                  if (!userReslult) {
                    res.status(404).send({ message: "User not found" });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;
  fs.exists(filePath, exists => {
    if (!exists) {
      res.status(404).send({ message: "Avatar do not exist." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}
async function updateUser(req, res) {
  let userData = req.body; 
  const saltRounds = 10;
  userData.email = req.body.email.toLowerCase()
  const params = req.params;
  if(userData.password){
   await bcrypt.hash(userData.password, saltRounds).then(hash=>{
     userData.password=hash
   }).catch(() =>{
     res.status(500).send({message: "Error encrypting password."})
   })
  }
  User.findByIdAndUpdate({ _id: params.id}, userData, (err, userUpdate) => {
    if(err){
      res.status(500).send({message: "Server error."})
    }else{
      if(!userUpdate){
        res.status(400).send({message: "User not found"});
      }else {
        res.status(200).send({message: "User updated successfully"});
      }

    }
   })
}

function activateUser(req, res){
  const {id} = req.params;
  const {active} = req.body;
  User.findByIdAndUpdate(id, {active}, (err, userStored) =>{
    if(err){
      res.status(500).send({
        message: "Server error."
      })
    }else if(!userStored){
      res.status(404).send({
        message: "User not found"
      })
    }else{
      if(active === true){
        res.status(200).send({
          message: "User activated successfully."
        })
      }else{
        res.status(200).send({
          message: "User deactivated successfully"
        })
      }
      
    }
  } )
}

function deleteUser(req, res){
  const {id} = req.params;
  User.findByIdAndRemove(id, (err, userDeleted) => {
    if(err){
      res.status(500).send({
        message: "Server error."
      })
    }else {
      if(!userDeleted){
        res.status(404).send({
          message: "User not found."
        })
      }else{
        res.status(200).send({
          message: "User deleted successfully."
        })
      }
    }
  })
}

async function createUser(req, res){
  const user = new User();
  const saltRounds = 10;
  const {name, lastname, email, role, password} = req.body;
 
  user.name = name;
  user.lastname= lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = true;
  if(!password){
    res.status(500).send({
      message: "Password is required."
    })
  }else{
    await bcrypt.hash(password, saltRounds).then(hash=>{
      user.password = hash;
      user.save((err, userStored)=> {
        if(err){
          res.status(500).send({
            message: "User already exist."
          })
        }else {
          if(!userStored){
            res.status(500).send({
              message: "Error creating user."
            })
          }else {
            res.status(200).send({message: "User created successfully."})
          }
        }
      })
    }).catch(()=>{
      res.status(500).send({message: "Error encrypting password."})
    })
      
     
      
  }
  
}
module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  createUser
};
