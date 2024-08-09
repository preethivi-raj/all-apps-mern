import express from "express";
import dotenv  from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000; 

const __dirname = path.resolve();

app.use(cors({origin: "http://localhost:3000" , credentials: true})); // to allow the frontend to access the backend

app.use(express.json()); // to parse the incoming request with JSON payloads
app.use(cookieParser()); // to parse the incoming cookies

app.use("/api/auth" , authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "/frontend/build")));

    app.get("*" , (req , res)=>{    
        res.sendFile(path.resolve(__dirname , "frontend" , "build" , "index.html"));
    })
}

app.listen(PORT , ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})