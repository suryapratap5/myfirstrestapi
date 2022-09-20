import mongoose from "mongoose";

const refreshTokenShcema = new mongoose.Schema({
    token : {type : String, unique : true}
}, {timestamps : false});

export default mongoose.model('RefreshToken', refreshTokenShcema, 'refreshTokens');


