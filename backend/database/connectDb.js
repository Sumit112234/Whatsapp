import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';



configDotenv();
const connectDb =  async function(){
   
   
    let uri = process.env.MONGO_URI;
    // console.log(uri);

    try {

        await mongoose.connect(uri);
        console.log("Mongoose Connected!");
    } catch (error) {
        console.log("Mongoose not connected!", error);
    }
}

export default connectDb;
// module.exports = connectDb;