const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const bodyparser = require('body-parser');
const errorController = require('./controllers/error');
const Users = require('./models/user');
const Messages = require('./models/messages');
const Group = require('./models/group');
const GroupMember = require('./models/groupmember')
const socketio = require('socket.io');
const sequelize = require('./util/database');

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = socketio(server)

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


Users.hasMany(Messages, { foreignKey: 'user_id' });
Messages.belongsTo(Users, { foreignKey: 'user_id' });

Group.belongsTo(Users, { foreignKey: 'created_by' });
GroupMember.belongsTo(Users, { foreignKey: 'user_id' });

GroupMember.belongsTo(Group, { foreignKey: 'group_id' });
Group.hasMany(GroupMember, { foreignKey: 'group_id' });

sequelize.sync()
    .then((result) => {
        console.log('database synced');
    }).catch((err) => {
        console.log(err);
    });

io.on('connection', (socket) => {
    console.log('----------A user connected----------');
    socket.on('message', (msg) => {
        if (msg.groupId) {
            socket.to(msg.groupId).emit('message', msg);
        }
        else {
            socket.broadcast.emit('message', msg);
        }
    })
})