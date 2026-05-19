import express  from "express";
import cors from 'cors' ;
import userRouter from "./routes/auth.routes";
import { cleanupExpiredToken } from "./lib/cleanup";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/auth",userRouter);


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");

    cleanupExpiredToken();
    setInterval(cleanupExpiredToken, 24 * 60 * 60 * 1000);
})