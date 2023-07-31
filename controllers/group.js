
const Groups = require('../models/group');

const GroupMember = require('../models/groupmember');

const Messages = require('../models/messages');

const Users = require('../models/user');

async function createGroup(req, res) {
    try {
        const { group_name } = req.body;
        const { id } = req.user;
        const user_id = id;

        //creating the group
        const createdGroup = await Groups.create({
            name: group_name,
            created_by: user_id
        })

        //create group member record
        await GroupMember.create({
            group_id: createdGroup.id,
            user_id,
            is_admin: true
        })

        res.status(201).json({ group_id:createGroup.id, groupname:group_name});
    } catch (err) {
        console.log(err)
    }
}

async function getGroups(req, res) {
    try {
        const groups = await Groups.findAll();
        res.status(200).json({ groups });
    } catch (err) {
        console.log(err);
    }
}

const deleteGroup = async(req, res)=>{
    try {
        const { group_id } = req.params;

        //delete associated group members first
        await GroupMember.destroy({
            where:{ group_id },
        })

        //delete group messages
        await Messages.destroy({
            where: { group_id },
        })

        //Delete the group 
        await Groups.destroy({
            where:{id: group_id},
        })

        res.status(200).json({message: 'Group and associated messages Deleted Succesfully'})
    } catch (err) {
        console.log(err);        
    }
}

async function inviteMemberToGroup(req, res) {
    try {
        const { group_id } = req.params;
        const { userName } = req.body;

        //finding the user by name
        const user = await Users.findOne({where: {name: userName}});

        if(!user){
            return res.status(404).json({error: 'user not found'});
        }

        //check if user is already a member of group
        const existingMember = await GroupMember.findOne({
            where: { group_id, user_id:user.id},
        })

        if(existingMember){
            return res.status(400).json({error: 'User is already member of group'});
        }

        //adding the user as a member
        await GroupMember.create({
            group_id,
            user_id:user.id,
            is_admin:false
        })

        res.status(200).json({ message: 'User invited successfully'});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createGroup,
    getGroups,
    deleteGroup,
    inviteMemberToGroup
}

