import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true},
    address: { type: String, required: true},
    contact: { type: String, required: true},
    email: { type: String, required: true},
    website: { type: String, required: true},
    location: { type: String, required: true},
    status: { type: String, required: true},
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false},
    deleted_at: { type: String, required: false},
    allProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
})

const storeModel = mongoose.model('Store', StoreSchema)

export default storeModel;