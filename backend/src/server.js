import dotenv from 'dotenv';
dotenv.config();

// import app from './app.js';
import connectDB from './config/db.config.js';
import httpServer from './app.js';

const PORT = process.env.PORT || 3001;


connectDB()
.then(()=>{
    httpServer.listen(PORT, ()=>{
        console.log(`servers is listening on port ${PORT}`);
    });
})
.catch((err)=>{
    console.error("Database Error:", err);
    process.exit(1);
});
    