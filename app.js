const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const errorController = require('./controllers/error');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();

const Users = require('./models/user');

const userRoutes = require('./routes/user');

app.use(bodyparser.json());

app.use('/user', userRoutes);

app.use(errorController.get404);

sequelize.sync()
.then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});