import express from 'express'
import { getAllRegisters, createRegister, getRegisterByID, getRegisterByStoreName, getRegisterByDevice, updateRegister, deactivateRegister } from '../controllers/register.controller.js'

const router = express.Router();

router.route('/').get(getAllRegisters);
router.route('/').post(createRegister);
router.route('/:id').get(getRegisterByID);
router.route('/store/:store_name').get(getRegisterByStoreName);
router.route('/device/:deviceId').get(getRegisterByDevice);
router.route('/:id').patch(updateRegister);
router.route('/:id').delete(deactivateRegister);

export default router;