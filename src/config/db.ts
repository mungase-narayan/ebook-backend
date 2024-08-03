import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async ()=> {
    try {
        mongoose.connection.on('connected', ()=> {
            console.log("Connected to MongoDB Successfully :");
        });

        mongoose.connection.on("error", (err)=> {
            console.error("Error connecting to MongoDB :", err);
        });

        await mongoose.connect(config.databaseUrl as string);

    } catch (error) {
        console.error("Error connecting to MongoDB :");
        process.exit(1);
    }
}

export default connectDB;