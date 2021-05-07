// require('dotenv').config();
require('./database');
const {port} = require('./config');

const app = require('./app')
app.listen(port,'0.0.0.0', () =>{
    console.log("server on port", port);
} )