import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env" });

const url = process.env.MONGO_URI;

const connect = async () => {
	try {
		await mongoose.connect(url);
		console.log("connected to mongoDB Successfully");
	} catch (error) {
		console.log("MongoDB connection error");
	}
};

//function call
connect();
