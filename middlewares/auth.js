import CustomErrorHandler from "../Services/CustomErrorHandler";
import JwtService from "../Services/JwtService";

const auth = (req, res, next)=>{
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const {_id, role} = JwtService.verify(token);
        
        const user = {_id, role};
        req.user = user;
        next();
    } catch (err) {
        return next(CustomErrorHandler.unAuthorized())
    }
    
}


export default auth;