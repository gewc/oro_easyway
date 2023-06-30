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
        const data = await Product.find({store: id}).sort({_id: -1});
        res.status(200).json({ message: "", status: 'SUCCESS', data: data });
    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};


const getProductsAndStore = async (req,res) => {
    try {
        const {search, mapRegion} = req.params
        const searchText = search.toLowerCase()
        const location = JSON.parse(mapRegion)
        const storeIds = []
        console.log('Search', searchText)
        console.log('mapRegion', location)
        
        //Full-Text Search Algo MongoDB

        let sData = await Product.aggregate([
            { $match: 
                {
                    name: new RegExp(searchText, 'i')
                }
            },
            { $lookup:
                {
                   from: "stores",
                   localField: "store",
                   foreignField: "_id",
                   as: "storeData"
                }
            },
            
        ]) .then(data => {

            let nData = dijkstra(data, location)

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
        const { name, description, image, price, quantity, _id } = req.body;
        const nname = name.toLowerCase()

        const data = await Store.findOne({_id});
        if(!data) throw new Error("Store does not exist!");

        const proddata = await Product.find({name: name, store: _id});
        console.log("Product Data",proddata)
        if(proddata.length > 0) throw new Error("Product is already exist!");

        const newData = await Product.create({
            name: nname, 
            description, 
            image,
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
        const { name, description, image, price, quantity } = req.body;

        // Update Product
        await Product.findByIdAndUpdate({ _id: id}, {
            name, 
            description, 
            image,
            price, 
            quantity,
            updated_at: dateNow
        })
        res.status(200).json({ message: "Product updated successfully", status: 'SUCCESS', data: {} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }
};

const deactivateProduct = async (req,res) => {
    try {
        const {id} = req.params;

        // Delete Product
        await Product.findByIdAndUpdate({ _id: id}, {
            deleted_at: dateNow
        })
        res.status(200).json({ message: "Product deleted successfully", status: 'SUCCESS', data: {} });

    } catch (error) {
        res.status(200).json({ message: error.message, status: 'FAILED', data: {} });
    }

};

//DIJKSTRA ALGORITHM
const dijkstra = (data, mapRegion) => {
    const distances = {};
    const paths = {};

    // Define the location of the person as a latitude and longitude coordinate
    const personLocation  = {
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude
    }

    try {
        // Initialize distances and paths with infinite values
        for (let store in data) {
            distances[store] = Infinity;
            paths[store] = [];
        }

        // The person is the starting node
        distances['person'] = 0;
        paths['person'] = ['person'];

        // Initialize the priority queue with the person as the starting node
        const priorityQueue = [{ node: 'person', distance: 0 }];

        while (priorityQueue.length) {
        // Get the node with the smallest distance from the priority queue
        const { node, distance } = priorityQueue.shift();

        // Go through each neighbor of the node
        for (let store in data) {
            const storeLocation = JSON.parse(data[store].storeData[0]?.location);
            const distanceToStore = distanceBetweenPoints(personLocation.latitude, personLocation.longitude, storeLocation.latitude, storeLocation.longitude);
            
            if (store !== node && distance + distanceToStore < distances[store]) {
            // If the distance to the store through the current node is less than the stored distance, update the distances and paths
            distances[store] = distance + distanceToStore;
            paths[store] = [...paths[node], store];
            // Add the store to the priority queue with its new distance
            priorityQueue.push({ node: store, distance: distances[store] });
            }
        }

        // Sort the priority queue based on the smallest distance
        priorityQueue.sort((a, b) => a.distance - b.distance);
        }

        // Find the closest store to the person
        let closestStore = null;
        let shortestPath = null;
        let shortestDistance = Infinity;
        for (let store in data) {
            if (distances[store] < shortestDistance) {
                shortestDistance = distances[store];
                closestStore = store;
                shortestPath = paths[store];
            }
        }
        
        //Sort data index according to distance
        var sorted = Object.keys(distances).sort(function(a,b){return distances[a]-distances[b]})
        sorted = sorted.slice(1)
        
        var sortedData = [];
        sorted.map( v => {
            sortedData.push(data[parseInt(v)])
        })

        return sortedData;
    } catch (error) {
      console.log(error.message)
    }

}

const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
  }

const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // in kilometers
    const latDiff = toRadians(lat2 - lat1);
    const lonDiff = toRadians(lon2 - lon1);
    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

export { 
    getAllProducts, 
    getProductsByStore, 
    createProduct, 
    getProductByID, 
    updateProduct, 
    deactivateProduct, 
    getProductsAndStore 
};