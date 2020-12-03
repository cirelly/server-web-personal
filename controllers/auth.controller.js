const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../models/user.models');
 
function willExpireToken(token){
    const {exp} = jwt.decodeToken(token);
    const currentDate = moment.unix();

    if(currentDate > exp){
        return true
    }
    return false; 
}

function refreshAccessToken(req, res){
    const { refreshToken } = req.body;
    const isTokenExpired = willExpireToken(refreshToken);
    if(isTokenExpired){
        res.status(404).send({
            message: "Token is expired."
        })
    }else {
        const { id } = jwt.decodeToken(refreshToken);
        User.findOne({_id : id}, (err, userStored) => {
            if(err){
                res.status(500).send({
                    message: "Server error."
                })
            }else {
                if(!userStored){
                    res.status(404).send({
                        message: "User not found"
                    })
                }else {
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    })
                }
            }
        })
    }
}

module.exports = {
    refreshAccessToken
}