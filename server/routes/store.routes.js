import express from 'express'
import { getAllStores, createStore, getStoreByID, getStoreByName, updateStore, deactivateStore } from '../controllers/store.controller.js'

const router = express.Router();

router.route('/').get(getAllStores);
router.route('/').post(createStore);
router.route('/:id').get(getStoreByID);
router.route('/store/:name').get(getStoreByName);
router.route('/:id').patch(updateStore);
router.route('/:id').delete(deactivateStore);

export default router;