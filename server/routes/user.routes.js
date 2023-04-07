import express from 'express'
import { getAllUsers, createUser, getUserByID, updateUser, deactivateUser } from '../controllers/user.controller.js'
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/login/').post(login);
router.route('/:id').get(getUserByID);
router.route('/:id').patch(updateUser);
router.route('/:id').delete(deactivateUser);

export default router;