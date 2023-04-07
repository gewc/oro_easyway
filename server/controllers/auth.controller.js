import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/user.js'

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email, password)
        const existingUser = await User.findOne({email});
        console.log(existingUser)
        if(!existingUser) return res.status(200).json({message: "User doesn't exist.", status: 'FAILED'});

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect) return res.status(200).json({message: "Email or Password doesn't found.", status: 'FAILED'} );

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'oroew', {expiresIn: "3h"});

        res.status(200).json({ message: "Login", status: 'SUCCESS', data: { result: existingUser, token} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const logout = async (req, res) => {};


export { login, logout };