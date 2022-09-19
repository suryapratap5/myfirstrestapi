import { SECRET_KEY } from "../config";
import jwt from 'jsonwebtoken';

class JwtService {
    static sign(payload, expiry = '120s', secret = SECRET_KEY){
        return jwt.sign(payload, secret, {expiresIn : expiry})
    }
}


export default JwtService;