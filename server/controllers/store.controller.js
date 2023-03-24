import mongoose from 'mongoose';
import Store from '../mongodb/models/store.js'
import Register from '../mongodb/models/register'
import User from '../mongodb/models/user.js'

let d = new Date();
let yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();
let hh = d.getHours();
let minutes = d.getMinutes();
let ss = d.getSeconds();

const dateNow = `${yyyy}-${mm}-${dd}  ${hh}:${minutes}:${ss}`;

const getAllStores = async (req,res) => {
    try {
        const stores = await Store.find({}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data: stores });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createStore = async (req,res) => {
    try {
        const { storeName, address, contact, email, website, location } = req.body;
        // const session = await mongoose.startSession();
        // session.startTransaction();

        const store = await Store.findOne({name: storeName});
        if(store) throw new Error("Store is already exist!");

        const newData = await Store.create({
            name: storeName, 
            address, 
            contact, 
            email, 
            website, 
            location, 
            status: "Approved", 
            created_at: dateNow
        });
        
        // await user.save({ session });
        // await session.commitTransaction();

        res.status(200).json({message: 'Your store details is now updated.', status: 'SUCCESS', data: newData });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
    
};

const getStoreByID = async (req,res) => {
    try {
        const {id} = req.params;
        const storeExist = await Store.findOne({ _id: id }).populate('creator');

        if(storeExist) {
            res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: storeExist });
        }else{
            res.status(200).json({ message: "Store not found!", status: 'FAILED', data: {} });
        }

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getStoreByName = async (req,res) => {
    try {
        const {name} = req.params;
        const isExist = await Store.findOne({ name });
        console.log(name)

        if(isExist) {
            res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: isExist });
        }else{
            res.status(200).json({ message: "Store not found!", status: 'FAILED', data: {} });
        }

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const updateStore = async (req,res) => {
    try {
        const {id} = req.params;
        const { name, address, contact, email, website, location } = req.body;

        const oldStore = await Store.findOne({ _id: id }); // get first the old store details

        // Update Register store name
        await Register.findByIdAndUpdate({ store_name: oldStore.name}, {
            store_name: name, 
            updated_at: dateNow
        })

        // Update Store details
        await Store.findByIdAndUpdate({ _id: id}, {
            name, 
            address, 
            contact, 
            email, 
            website, 
            location,
            updated_at: dateNow
        })
        res.status(200).json({ message: "Store updated successfully", status: 'SUCCESS', data: {} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const deactivateStore = async (req,res) => {
    try {
        const {id} = req.params;
        const { name, address, contact, email, website, location } = req.body;

        await Store.findByIdAndUpdate({ _id: id}, {
            deleted_at: dateNow
        })
        res.status(200).json({ message: "Store deleted successfully", status: 'SUCCESS', data: {} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

export { getAllStores, createStore, getStoreByID, getStoreByName, updateStore, deactivateStore };