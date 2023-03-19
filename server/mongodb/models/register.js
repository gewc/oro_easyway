import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
    store_name: { type: String, required: true},
    status: { type: String, required: true},
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false},
    deleted_at: { type: String, required: false},
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
})

const registerModel = mongoose.model('Register', RegisterSchema)

export default registerModel;