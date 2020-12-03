const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

//Load routings
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//Config HEADER HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
      );
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
      next();
})


//Basic Routes
app.use(`/api/`, authRoutes)
app.use(`/api`, userRoutes)


module.exports = app;