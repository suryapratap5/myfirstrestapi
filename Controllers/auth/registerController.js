import Joi from "joi";
import User from "../../models/User";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../Services/JwtService";
import { REFRESH_KEY } from "../../config";
import RefreshToken from "../../models/refreshToken";

const registerController ={
    
   async register(req, res , next){
        // login for user reigstrations
        // validation
        const registerSchema = Joi.object({
            name : Joi.string().min(3).max(30).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password : Joi.ref('password')
            
        })

        // console.log(req.body);
        const {error} = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // check user already exists in database
        try {
            const exist = await User.exists({email : req.body.email})
            
            if(exist){
                return next(CustomErrorHandler.alreadyExist('User already exists'));
            }

        } catch (err) {
            return next(err);
        }

        // Hashpassword
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // console.log(hashedPassword)
        
        // prepare the model 
        const {name , email} = req.body;

        const user = new User({name , email, password : hashedPassword});
        let access_token;
        let refresh_token
        try {
            const result = await user.save(user);
            // console.log(result);

            // Token
           access_token = JwtService.sign({_id : result._id, role : result.role});

           refresh_token = JwtService.sign({_id : result._id, role : result.role}, '1y', REFRESH_KEY);

           // save refresh_token in database
           await RefreshToken.create({token : refresh_token});


        } catch (error) {
            return next(error)
        }

        return res.json({success : true, access_token, refresh_token})
    }
}



export default registerController;