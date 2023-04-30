import Product from '../mongodb/models/product.js'
import Store from '../mongodb/models/store.js'
import { isPointWithinRadius } from 'geolib';

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
        console.log(id)
        const data = await Product.find({store: id}).sort({created_at: -1});
        res.status(200).json({ message: "", status: 'SUCCESS', data: data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const getProductsAndStore = async (req,res) => {
    try {
        const {search} = req.params
        const searchText = search.toLowerCase()
        const storeIds = []
        console.log('Search', searchText)
        
        const data = await Product.find({name: new RegExp(searchText, 'i')});
        data.map((v, k) => {
            if(!storeIds.includes(v.store)){
                storeIds.push(v.store)
            }
        })

        const dijkstra = (data) => {
            const tempData = [];
            const range = [ 3000, 4000, 5000, 6000, 7000, 8000, 9000] // range by kilometers
            const centerPoint = {
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude
            }
    
            try {
              for (let i = 0; i <= range.length;) {
                const selectedRange = range[i];
                data.map((item, key) => {
                  let loc = JSON.parse(item.location)
                  let point = {
                    latitude: loc.latitude,
                    longitude: loc.longitude
                  }
                  let isRange = isPointWithinRadius(point, centerPoint, selectedRange)
                  if(!tempData.includes(item) && isRange){
                    tempData.push(item)
                  }
                })
    
                if(tempData.length == 0){ // if no store found on that range
                  i++;
                }else{ // if store found, end loop
                  i += 100; // set increment index to end the loop
                }
                
              }
              return tempData;
            } catch (error) {
              console.log(error.message)
            }
    
        }

        const storeData = Store.find({ _id: {$in: storeIds}})
            .then(data => {
                let nData = dijkstra(data)
                console.log('storeData',nData)
                res.status(200).json({ message: "Search Materials", status: 'SUCCESS', data: nData });
            })
            .catch(error => {
                console.log(error.message);
                res.status(200).json({ message: error.message, status: 'Failed', data: {} });
            })

        
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const createProduct = async (req,res) => {
    try {
        const { name, description, price, quantity, _id } = req.body;
        const nname = name.toLowerCase()

        const data = await Store.findOne({_id});
        if(!data) throw new Error("Store does not exist!");

        const proddata = await Product.find({name: name, store: _id});
        console.log("Product Data",proddata)
        if(proddata.length > 0) throw new Error("Product is already exist!");

        const newData = await Product.create({
            name: nname, 
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

const updateProduct = async (req,res) => {
    try {
        const {id} = req.params;
        const { name, description, price, quantity } = req.body;

        // Update Store details
        await Product.findByIdAndUpdate({ _id: id}, {
            name, 
            description, 
            price, 
            quantity,
            updated_at: dateNow
        })
        res.status(200).json({ message: "Product updated successfully", status: 'SUCCESS', data: {} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

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