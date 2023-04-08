import Register from '../mongodb/models/register.js'
import Store from '../mongodb/models/store.js'

let d = new Date();
let yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();
let hh = d.getHours();
let minutes = d.getMinutes();
let ss = d.getSeconds();

const dateNow = `${yyyy}-${mm}-${dd}  ${hh}:${minutes}:${ss}`;

const getAllRegisters = async (req,res) => {
    try {
        const data = await Register.find({}).sort({created_at: -1}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createRegister = async (req,res) => {
    try {
        const { storeName, deviceId } = req.body;
        // console.log(deviceId)

        const data = await Register.findOne({store_name: storeName});
        if(data) throw new Error("Sorry the store name is already exist!");

        const newData = await Register.create({
            store_name: storeName, 
            status: 'Pending', 
            device_id: deviceId,
            created_at: dateNow, 
        });

        res.status(200).json({message: 'Your store is added. Please wait for the approval of the administrator.', status: 'SUCCESS', data: newData });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getRegisterByID = async (req,res) => {};


const getRegisterByStoreName = async (req,res) => {
    try {
        const {store_name} = req.params;
        const isExist = await Register.findOne({ store_name });
        console.log(store_name)

        if(isExist) {
            const isStoreExist = await Store.findOne({ name: store_name });
            if(isStoreExist){ 
                res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: { register: isExist, store: isStoreExist } });
            }else{
                res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: { register: isExist, store: null } });
            }
            
        }else{
            res.status(200).json({ message: "Store not found!", status: 'FAILED', data: {} });
        }

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getRegisterByDevice = async (req,res) => {
    try {
        const {deviceId} = req.params;
        const isExist = await Register.findOne({ device_id: deviceId });
        // console.log(deviceId)

        if(isExist) {
            const isStoreExist = await Store.findOne({ name: isExist.store_name });
            if(isStoreExist){ 
                res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: { register: isExist, store: isStoreExist } });
            }else{
                res.status(200).json({ message: "Store doesn't have a details yet.", status: 'SUCCESS', data: { register: isExist, store: null } });
            }
            
        }else{
            res.status(200).json({ message: "Store not found!", status: 'FAILED', data: {} });
        }

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};


const updateRegister = async (req,res) => {
    try {
        
        const {id} = req.params;
        const { status } = req.body;
        // Update Register store name
        const data = await Register.findByIdAndUpdate({ _id: id }, {
            status, 
            updated_at: dateNow
        })

        res.status(200).json({ message: "Register updated successfully", status: 'SUCCESS', data });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const deactivateRegister = async (req,res) => {};

export { getAllRegisters, createRegister, getRegisterByID, getRegisterByStoreName, getRegisterByDevice, updateRegister, deactivateRegister };