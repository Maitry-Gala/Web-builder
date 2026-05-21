import express  from "express";
import cors from 'cors' ;
import userRouter from "./routes/auth.routes";
import { cleanupExpiredToken } from "./lib/cleanup";
import websiteRouter from "./routes/website.routes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // your React app URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

app.use("/api/v1/auth",userRouter);
app.use("/api/v1/websites",websiteRouter);


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");

    cleanupExpiredToken();
    setInterval(cleanupExpiredToken, 24 * 60 * 60 * 1000);
})