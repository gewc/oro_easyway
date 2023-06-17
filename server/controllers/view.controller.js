import View from '../mongodb/models/view.js'
import Product from '../mongodb/models/product.js'

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
        const data = await View.find({store_id: storeId, status: 'New'}).sort({_id: -1}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getAllViewbyProduct = async (req,res) => {
    try {
        const { id } = req.params;
        const data = await View.find({product_id: id, status: 'New'}).sort({_id: -1}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createView = async (req,res) => {
    try {
        const { storeId, prodId, address, deviceId } = req.body;
        // const data = await View.findOne({store_name: storeName});
        // if(data) throw new Error("Sorry the store name is already exist!");

        const newData = await View.create({
            store_id: storeId, 
            product_id: prodId, 
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
        const {storeId} = req.params;
        const pId = [];
        let countD = {};

        const sdata = await View.find({store_id: storeId, status: 'New'}).sort({_id: -1}).limit(req.query._end);
        
        sdata.map((item) => {
            let prod = String(item.product_id);
           if(!pId.includes(prod)){
                pId.push(prod);
                countD[prod] = 1;
           }else{
            countD[prod] = countD[prod] +1
           }
        });

        const pdata = await Product.find({_id: { $in: pId }}).limit(req.query._end);
        const data = {pdata , countD}

        res.status(200).json({message: 'View added!', status: 'SUCCESS', data });


    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getViewByDevice = async (req,res) => {};


const updateViewByStore = async (req,res) => {
    try {
        
        const { storeId, pId } = req.params;
        // Update View store name
        const data = await View.updateMany (
            { store_id: storeId, product_id: pId, status: 'New' },
            {
                status: "Seen", 
                updated_at: dateNow
            }
        )

        res.status(200).json({ message: "View updated successfully", status: 'SUCCESS', data });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const deactivateView = async (req,res) => {};

export { getAllViews, getAllViewbyStore, createView, getViewByID, getAllViewbyProduct, getViewByStoreName, getViewByDevice, updateViewByStore, deactivateView };