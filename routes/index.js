import express from 'express';
import { registerController } from '../Controllers/index.js';

const router = express.Router();

router.post('/register', registerController.register)




export default router;