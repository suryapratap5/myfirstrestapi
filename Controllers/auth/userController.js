import User from "../../models/User";
import CustomErrorHandler from "../../Services/CustomErrorHandler";

const userController = {

   async me(req, res, next){
    // console.log(req.user);

    try {
        const user = await User.findOne({_id : req.user._id}).select('-password -updatedAt -__v');

        if(!user){
            return next(CustomErrorHandler.noFound())
        }
         
        res.json({success : true, user});
    } catch (err) {
        return next(err);
    }
    }
}


export default userController;