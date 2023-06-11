import View from '../mongodb/models/view.js'
import Store from '../mongodb/models/store.js'

let d = new Date();
let yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();
let hh = d.getHours();
let minutes = d.getMinutes();
let ss = d.getSeconds();

const dateNow = `${yyyy}-${mm}-${dd}  ${hh}:${minutes}:${ss}`;

const getAllViews = async (req,res) => {};

const getAllViewbyStore = async (req,res) => {
    try {
        const { storeId } = req.params;
        const data = await View.find({store_id: storeId, status: 'New'}).sort({created_at: -1}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createView = async (req,res) => {
    try {
        const { storeId, address, deviceId } = req.body;
        // const data = await View.findOne({store_name: storeName});
        // if(data) throw new Error("Sorry the store name is already exist!");

        const newData = await View.create({
            store_id: storeId, 
            address: address[0].city, 
            device_id: deviceId,
            status: 'New', 
            created_at: dateNow, 
        });

        res.status(200).json({message: 'View added!', status: 'SUCCESS', data: newData });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getViewByID = async (req,res) => {};


const getViewByStoreName = async (req,res) => {
    try {
        const {store_name} = req.params;
        const isExist = await View.findOne({ store_name });
        console.log(store_name)

        if(isExist) {
            const isStoreExist = await Store.findOne({ name: store_name });
            if(isStoreExist){ 
                res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: { View: isExist, store: isStoreExist } });
            }else{
                res.status(200).json({ message: "Store Exist!", status: 'SUCCESS', data: { View: isExist, store: null } });
            }
            
        }else{
            res.status(200).json({ message: "Store not found!", status: 'FAILED', data: {} });
        }

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getViewByDevice = async (req,res) => {};


const updateViewByStore = async (req,res) => {
    try {
        
        const { storeid } = req.params;
        // Update View store name
        const data = await View.find({ store_id: storeid, status: 'New', created_at: { $lt: new ISODate(dateNow) } }).update({
            status: "Seen", 
            updated_at: dateNow
        })

        res.status(200).json({ message: "View updated successfully", status: 'SUCCESS', data });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const deactivateView = async (req,res) => {};

export { getAllViews, getAllViewbyStore, createView, getViewByID, getViewByStoreName, getViewByDevice, updateViewByStore, deactivateView };