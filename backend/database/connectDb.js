
import mongoose from 'mongoose';



import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect DB")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}
export default connectDb;
// module.exports = connectDb;