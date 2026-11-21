import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import { userRouter } from './routes/userRoute.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRouter);


async function connectToDB(){
    try{
    const mongo_uri = process.env.MONGO_URI;
    const port = process.env.PORT;

        if(!mongo_uri){
            throw new Error("Database URI not found");
        }
        
        await mongoose.connect(mongo_uri);
        
        app.listen(port, () => {
            console.log("Server is now connected to database and listening to PORT", port);
        })
    } catch(error){
        console.log(error)
    }
}
connectToDB();