import mongoose from "mongoose";

// Connecting Database
export function connectDatabase(MONGO_URL) {
    try {
        mongoose.connect(MONGO_URL);
        console.log("Database Connected Sucessfully");
    } catch (error) {
        console.log("Error Connecting Database");
    }
}