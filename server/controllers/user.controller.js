import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/user.js'

let d = new Date();
let yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();
let hh = d.getHours();
let minutes = d.getMinutes();
let ss = d.getSeconds();

const dateNow = `${yyyy}-${mm}-${dd}  ${hh}:${minutes}:${ss}`;


const getAllUsers = async (req,res) => {
    res.send({ message: 'Hello World!'});
};

const createUser = async (req,res) => {
    try {
        const {name, email, password, address, acctType } = req.body;

        const userExist = await User.findOne({email});
        if(userExist) return res.status(200).json({message: 'Email address already exist!', status: 'FAILED', data: {} });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            address, 
            acctType, 
            created_at: dateNow});

        const token = jwt.sign({ email, id: newUser._id }, 'oroew', {expiresIn: "3h"});

        res.status(200).json({message: 'Successfully added!', status: 'SUCCESS', data: newUser });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
    
};

const getUserByID = async (req,res) => {};

const updateUser = async (req,res) => {};

const deactivateUser = async (req,res) => {};

export { getAllUsers, createUser, getUserByID, updateUser, deactivateUser };