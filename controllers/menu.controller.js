const Menu = require('../models/menu.models');

function addMenu(req, res) {
    const {title, url, order, active} = req.body;
    const menu = new Menu();
    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;
    menu.save((err, createdMenu) => {
        if(err){
            res.status(500).send({message: "Server Error."})
        }else if (!createdMenu){
            res.status(404).send({message: "Error creating Menu."})
        }else {
            res.status(200).send({message: "Menu created successfully."})
        }
    })
}

function getMenus(req, res) {
    let params = req.params.order;
    Menu.find()
        .sort({order: params})
        .exec((err, menuStored)=> {
            if(err){
                res.status(500).send({message: "Server Error."})
            }else if(!menuStored){
                res.status(404).send({message: "Menus is not found"})
            }else {
                res.status(200).send({menu: menuStored})
            }
        })    
    
    }

function updateMenuOrder(req, res){
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdated)  =>{
        if(err){
            res.status(500).send({message: "Server Error."})
        }else if(!menuUpdated){
            res.status(404).send({message: "Menu is not found."})
        }else {
            res.status(200).send({message: "Menu updated successfully"})
        }
    })

}
function activateMenu(req, res){
    let {id} = req.params;
    const {active} = req.body;
    
    Menu.findByIdAndUpdate(id, {active}, (err, menuUpdated)  =>{
        if(err){
            res.status(500).send({message: "Server Error."})
        }else if(!menuUpdated){
            res.status(404).send({message: "Menu is not found."})
        }else {
            if(active === true){
                res.status(200).send({message: "Menu activated successfully"})
            }else{
                res.status(200).send({message: "Menu deactivated successfully"})
            }
            
        }
    })

}
module.exports = {
    addMenu,
    getMenus,
    updateMenuOrder,
    activateMenu
}