import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req,res,next) =>{
    try{
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({ message: "Invalid token" });
    }
}

export default authMiddleware;