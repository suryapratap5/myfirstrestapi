import express from 'express';
import { loginController, logoutController, refreshController, registerController, userController, productController } from '../Controllers/index.js';
import admin from '../middlewares/admin.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerController.register)

router.post('/login', loginController.login)

router.get('/me',auth, userController.me)

router.post('/refresh', refreshController.refresh);

router.post('/logout',auth, logoutController.logout);

router.post('/products',[auth, admin], productController.store);

router.put('/products/:id',[auth, admin], productController.update);

router.delete('/products/:id',[auth, admin], productController.delete);

router.get('/products', productController.index);

router.get('/products/:id', productController.singleProduct);




export default router;