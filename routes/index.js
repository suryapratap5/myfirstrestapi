import express from 'express';
import { loginController, registerController } from '../Controllers/index.js';

const router = express.Router();

router.post('/register', registerController.register)

router.post('/login', loginController.login)




export default router;