const Messages = require('../models/messages');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const Users = require('../models/user');

const addMessage = async(req, res, next)=>{
    try {
        const msg = req.body.message;
        const data = await Messages.create({
            message:msg,
            userId:req.user.id,
        });
        res.json({ datavalues: data});
        
    } catch (err) {
        console.log(err);
        
    }
}

const getMessage = async(req, res, next)=>{
    try {
        const lastMsgId = req.query.lastmsgid || 0;
        const messages = await Messages.findAll({
            where:{
                id: { [Op.gt]: lastMsgId },
                groupId: null
            },
            include: [
                {
                    model: Users,
                    attributes: ['name'],
                }
            ]
        });

        const formattedMessages = messages.map((message) =>({
            id:message.id,
            message:message.message,
            sender: message.user.name,
            groupId: message.groupId,
        }))
        res.status(200).json({ messages:formattedMessages });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addMessage,
    getMessage
}
