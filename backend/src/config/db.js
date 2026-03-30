import mongoose from "mongoose";
import { MONGO_URI } from "../constants.js"

const connectDB = async () => {
   try {
      const conn = await mongoose.connect(`${MONGO_URI}`);
      console.log(`(MONGODB CONNECTED) ${conn.connection.host}`);
   } catch (error) {
      console.error(`(MONGODB ERROR) ${error.message}`);
      process.exit(1);
   }
};

export default connectDB;
