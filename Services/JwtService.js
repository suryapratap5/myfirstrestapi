import { SECRET_KEY } from "../config";
import jwt from 'jsonwebtoken';

class JwtService {
    static sign(payload, expiry = '120s', secret = SECRET_KEY){
        return jwt.sign(payload, secret, {expiresIn : expiry})
    }

    static verify(token, secret = SECRET_KEY){
        return jwt.verify(token, secret)
    }
}


export default JwtService;