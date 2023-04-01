import Product from '../mongodb/models/product.js'
import Store from '../mongodb/models/store.js'

let d = new Date();
let yyyy = d.getFullYear();
let mm = d.getMonth() + 1;
let dd = d.getDate();
let hh = d.getHours();
let minutes = d.getMinutes();
let ss = d.getSeconds();

const dateNow = `${yyyy}-${mm}-${dd}  ${hh}:${minutes}:${ss}`;

const getAllProducts = async (req,res) => {
    try {
        const data = await Product.find({}).limit(req.query._end);
        res.status(200).json({ message: "", status: 'SUCCESS', data: data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getProductsByStore = async (req,res) => {
    try {
        const {id} = req.params
        const data = await Product.find({store: id}).sort({created_at: -1});
        res.status(200).json({ message: "", status: 'SUCCESS', data: data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getProductsAndStore = async (req,res) => {
    try {
        const {search} = req.params
        const data = await Product.aggregate([
            {
                $lookup: {
                    from: "store",
                    localField: "store",
                    foreignField: "_id",
                    as: "store_details",
                    "pipeline": [{
                        "$search": {
                          "compound": {
                            "must": [{
                              "queryString": {
                                "defaultPath": "name",
                                "query": `name: ${search}`
                              }
                            }],
                          }
                        }
                      },{
                        "$project": {
                          "_id": 0
                        }
                      }]
                }
            }
        ]);
        console.log(data)
        res.status(200).json({ message: "", status: 'SUCCESS', data: data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createProduct = async (req,res) => {
    try {
        const { name, description, price, quantity, _id } = req.body;

        const data = await Store.findOne({_id});
        if(!data) throw new Error("Store does not exist!");

        const proddata = await Product.find({name: name, store: _id});
        console.log("Product Data",proddata)
        if(proddata.length > 0) throw new Error("Product is already exist!");

        const newData = await Product.create({
            name, 
            description, 
            price, 
            quantity, 
            created_at: dateNow,
            store: _id
        });
        
        // await user.save({ session });
        // await session.commitTransaction();

        res.status(200).json({message: 'You added a new product.', status: 'SUCCESS', data: newData });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getProductByID = async (req,res) => {};

const updateProduct = async (req,res) => {};

const deactivateProduct = async (req,res) => {};

export { 
    getAllProducts, 
    getProductsByStore, 
    createProduct, 
    getProductByID, 
    updateProduct, 
    deactivateProduct, 
    getProductsAndStore 
};