import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/user.js'

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser.length) return res.status(404).json({message: "User doesn't exist."});

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Email or Password is invalid."});

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'oroew', {expiresIn: "3h"});

        res.status(200).json({ message: "Login", status: 'SUCCESS', data: { result: existingUser, token} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const logout = async (req, res) => {};


export { login, logout };