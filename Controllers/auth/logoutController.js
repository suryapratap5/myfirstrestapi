import RefreshToken from "../../models/refreshToken";

const logoutController = {
    async logout(req, res, next){

        try {
          await RefreshToken.deleteOne({token : req.body.refresh_token});
          
          res.json({success : true});

        } catch (err) {
            return next(new Error('Something went wrong in the database'))
        }
    }
}


export default logoutController;