import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    address: { type: String, required: false},
    acctType: { type: String, required: true},
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false},
    deleted_at: { type: String, required: false},
})

const userModel = mongoose.model('User', UserSchema)

export default userModel;