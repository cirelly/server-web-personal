const Newsletter = require('../models/newsletter.models');


const suscribreEmail = (req, res) => {
    const email = req.params.email;
    const newsletter = new Newsletter();

    if(!email){
        res.status(404).send({code: 404, message: 'Email is required'})
    }else{
        newsletter.email = email.toLowerCase();
        newsletter.save((err, newsletterstored) =>{
            if(err){
                res.status(500).send({ code: 500, message: "Email already exist."})
            }else if(!newsletterstored){
                res.status(404).send({code: 404, message: "Error at register newsletter."})
            }else{
                res.status(200).send({code:200, message: "Newsletter added successfully."})
            }
        })
    }

}


module.exports ={
    suscribreEmail
}