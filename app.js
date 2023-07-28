const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');
const errorController = require('./controllers/error');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();

const Users = require('./models/user');
const Messages = require('./models/messages');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(bodyparser.json());

app.use(userRoutes);
app.use(messageRoutes);

app.use(errorController.get404);

sequelize.sync()
.then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});