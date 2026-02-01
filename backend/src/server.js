import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";

dotenv.config();

connectDB()
.then ( () => {
    app.listen(process.env.PORT || 5001, () => {
        console.log(`Server is running at port: ${process.env.PORT || 5001}`);
    })
})
.catch( (error) => {
    console.error("Database connection failed !! ", error);
})