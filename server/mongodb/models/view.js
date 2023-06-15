import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema({
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    address: { type: String, required: true},
    device_id: { type: String, required: true},
    status: { type: String, required: true},
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false},
    deleted_at: { type: String, required: false},
})

const viewModel = mongoose.model('View', ViewSchema)

export default viewModel;