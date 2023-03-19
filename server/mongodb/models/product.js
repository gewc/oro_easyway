import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: mongoose.Schema.Types.Decimal128, required: true},
    quantity: { type: mongoose.Schema.Types.Decimal128, required: true},
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false},
    deleted_at: { type: String, required: false},
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
})

const productModel = mongoose.model('Product', ProductSchema)

export default productModel;