import  express  from "express";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import path from 'path'
const app = express();

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended : false}))
app.use(express.json()); 

// mongoose.connect(DB_URL);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', ()=>{
//     console.log('DB connected....')
// })

main().then(()=>console.log('connection successful...')).catch(err=>console.log('connection unsuccessful...', err.message))

async function main(){
    await mongoose.connect(DB_URL)
}

app.use('/uploads', express.static('uploads'))

app.use('/api',router);



app.use(errorHandler)
app.listen(APP_PORT, ()=>console.log(`listening on port ${APP_PORT}`));