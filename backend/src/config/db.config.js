import mongoose from "mongoose"

async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName : "TalkNest"
        });
        console.log("DB connected")
        return conn;
    }catch(err){
        console.error("DB Error :", err);
        throw err;
    }
}

export default connectDB;