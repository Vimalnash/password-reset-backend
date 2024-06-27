import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";
import { userRouter } from "./routes/user.js";

// initialize dotenv
dotenv.config();

// Initializing express
const app = express();

// Configuring dotenvs
const PORT = process.env.PORT;
// const MONGO_URL_LOCAL = process.env.MONGO_URL_LOCAL;
const MONGO_URL_ATLAS = process.env.MONGO_URL_ATLAS;

// Connect Db
connectDatabase(MONGO_URL_ATLAS);

// Initialize Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/user", userRouter);

// Test Server Connection
app.get("/test", (req, res) => {
    res.send({message: "Successfully Connected to App"});
})

// Activating/Listening Port
app.listen(PORT, () => {
    console.log(`
        Server Started at ${PORT},
        Listening to http://localhost:${PORT}
    `)
});