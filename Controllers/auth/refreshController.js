import Joi from "joi";
import { REFRESH_KEY } from "../../config";
import RefreshToken from "../../models/refreshToken";
import User from "../../models/User";
import CustomErrorHandler from "../../Services/CustomErrorHandler";
import JwtService from "../../Services/JwtService";

const refreshController = {

    async refresh(req, res, next){
        //validation

        const refreshSchema = Joi.object({
            refresh_token : Joi.string().required()
        })

        const {error} = refreshSchema.validate(req.body);
        if(error){
            return next(error)
        }

        // check database

        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({token : req.body.refresh_token});
            console.log(refreshToken)
            if(!refreshToken){

                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            let userId;
            try {
                const {_id} = JwtService.verify(refreshToken.token, REFRESH_KEY);
                userId = _id;

            } catch (err) {
                
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
                
            }

            const user = await User.findOne({_id : userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized('No user found'));

            }

            // tokens
            const access_token = JwtService.sign({_id : user._id, role : user.role});
            const refresh_token = JwtService.sign({_id : user._id, role : user.role}, '1y', REFRESH_KEY);

            // data whitelist
            await RefreshToken.create({token : refresh_token});

            res.json({success : true, access_token, refresh_token});



        } catch (err) {
            return next(new Error('Something went wrong' + err.message))
        }

    }
}


export default refreshController;