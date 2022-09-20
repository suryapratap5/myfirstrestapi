import path from 'path';

import multer from 'multer';
import CustomErrorHandler from '../../Services/CustomErrorHandler';
import Joi from 'joi';
import fs from 'fs';
import Product from '../../models/productModel';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image');

const productController = {

    // login for adding product
    async store(req, res, next) {

        // Multipart form data
        handleMultipartData(req, res, async(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            if(req.file === undefined){

               return res.status(404).json({success : false, message : 'Please upload image'});
            }

            const filePath = req.file.path;

            // validaton
            const productSchena = Joi.object({
                name : Joi.string().required(),
                price : Joi.string().required(),
                size : Joi.string().required()
            })

            const {error} = productSchena.validate(req.body);
            if(error){
                // Delete the upload image
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                })

                return next(error);
            }

            const {name, price, size } = req.body;

            let document;

            try {
                document = await Product.create({
                    name,
                    price,
                    size, 
                    image : filePath
                });
            } catch (err) {
                return next(err)
            }

            res.status(201).json({success : true, document})

        })

    },

    async update(req, res, next){
        handleMultipartData(req, res, async(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath;
            
            if(req.file){
                 filePath = req.file.path;
            }


            // validaton
            const productSchena = Joi.object({
                name : Joi.string().required(),
                price : Joi.string().required(),
                size : Joi.string().required(),
                image : Joi.string()
            })

            const {error} = productSchena.validate(req.body);
            if(error){
                // Delete the upload image
                if(req.file){

                    fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    })
                }

                return next(error);
            }

            const {name, price, size } = req.body;

            let document;

            try {
                document = await Product.findOneAndUpdate({_id : req.params.id},{
                    name,
                    price,
                    size, 
                    ...(req.file && {image : filePath})                    
                }, {new : true});
            } catch (err) {
                return next(err)
            }

            return res.json({success : true, document})

        })
    }, 

    // logic for deleting a product in database
    async delete(req, res, next){

        const document = await Product.findOneAndRemove({_id : req.params.id});

        if(!document){
            return next(CustomErrorHandler.noFound('Data is not availabe to be deleting'));
        }
        // image delete
        const imagePath = document._doc.image;
        // console.log(document.image)
        // console.log(document);
        // console.log(document._doc);

        fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        })

        return res.json({success : true, document});
    },

    // Get all products

    // pagination - mongoose pagination
    async index(req, res, next){
        try {
            const documents = await Product.find().select('-__v -updatedAt').sort({createdAt : -1});
            return res.json({success : true, documents});


        } catch (err) {
            return next(CustomErrorHandler.serverError())
        }
    },

    // Get single product from database
    async singleProduct(req, res, next){

        try {
            const document = await Product.findOne({_id : req.params.id}).select('-__v -updatedAt');

            if(!document){
                return next(CustomErrorHandler.noFound('Sorry this data is not available'));
            }
            return res.json({success : true , document});

        } catch (err) {
            return next(err);
        }
    }
}

export default productController;