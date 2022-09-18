import  express  from "express";
import { APP_PORT } from "./config/index.js";
import router from "./routes/index.js";
const app = express();




app.use(router);





app.listen(APP_PORT, ()=>console.log(`listening on port ${APP_PORT}`));