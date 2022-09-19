import Joi from "joi";
import User from "../../models/User";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../Services/JwtService";

const loginController = {

    async login(req, res, next){

        //validation
        const loginSchema = Joi.object({
            name : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        const {error} = loginSchema.validate();

        if(error){
            return next(error)
        }

        try {
            const user = await User.findOne({email : req.body.email});

            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);

            if(!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // token 
            const access_token = JwtService.sign({_id : user._id, role : user.role});

            return res.json({success : true, access_token})
        } catch (err) {
            
        }


    }
}


export default loginController;