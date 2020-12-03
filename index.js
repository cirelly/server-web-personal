require('dotenv').config();
require('./database');
const {port} = require('./config');

const app = require('./app')
app.listen(port, () =>{
    console.log("server on port", port);
} )