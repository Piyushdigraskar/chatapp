const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');
const errorController = require('./controllers/error');
const Users = require('./models/user');
const Messages = require('./models/messages');
const Groups = require('./models/group');
const GroupMember = require('./models/groupmember')

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();


const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/group');

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(bodyparser.json());

app.use(userRoutes);
app.use(messageRoutes);
app.use(groupRoutes);

app.use(errorController.get404);


Users.hasMany(Messages, { foreignKey: 'userId' });
Messages.belongsTo(Users, { foreignKey: 'userId' });

Group.belongsTo(Users, { foreignKey: 'created_by' });
GroupMember.belongsTo(Users, { foreignKey: 'user_id' });

GroupMember.belongsTo(Group, { foreignKey: 'group_id' });
Group.hasMany(GroupMember, { foreignKey: 'group_id' });

sequelize.sync()
.then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});