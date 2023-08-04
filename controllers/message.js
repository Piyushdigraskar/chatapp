const Messages = require('../models/messages');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
const Users = require('../models/user');

const addMessage = async (req, res, next) => {
    try {

        //console.log('THis is', req.body)
        //console.log('THis is', req.body.message)
        
        const msg = req.body.message.message;
        //console.log('THis is', msg)
        const data = await Messages.create({
            message: msg,
            user_id: req.user.id,
        });
        res.json({ datavalues: data });

    } catch (err) {
        console.log(err);

    }
}

const getMessage = async (req, res, next) => {
    try {
        const lastMsgId = req.query.lastmsgid || 0;
        const messages = await Messages.findAll({
            where: {
                id: { [Op.gt]: lastMsgId },
                group_id: null
            },
            include: [
                {
                    model: Users,
                    attributes: ['name'],
                }
            ]
        });

        const formattedMessages = messages.map((message) => ({
            id: message.id,
            message: message.message,
            sender: message.user.name,
            group_id: message.group_id,
        }))
        res.status(200).json({ messages: formattedMessages });
    } catch (err) {
        console.log(err);
    }
}

const addGroupMessage = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const message = req.body.message.message;

        const data = await Messages.create({
            message,
            user_id: req.user.id,
            group_id: groupId
        })
        res.json({ datavalues: data });
    } catch (err) {
        console.log(err)
    }
}

const getGroupMessages = async (req,res,next)=>{
    try {
        const groupId = req.params.groupId;

        const messages = await Messages.findAll({
            where:{ group_id: groupId},
            include:[
                {
                    model:Users,
                    attributes: ['name'],
                },
            ],
            order: [['id', 'ASC']]
        })
        const formattedMessages = messages.map((message)=>({
            id: message.id,
            message: message.message,
            sender: message.user.name
        }));
        res.json({ messages: formattedMessages});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addMessage,
    getMessage,
    addGroupMessage,
    getGroupMessages
}
