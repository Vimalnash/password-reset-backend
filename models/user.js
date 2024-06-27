import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        userName: {type:String, required: true, maxlength: 32, trim: true},
        email: {type: String, required: true, trim: true, unique: true},
        password: {type: String, required: true, trim: true},
        passwordReset: {type: String, trim: true,}
    },
    {
        timestamps: true
    }
);


const USER = mongoose.model("users", userSchema);
export { USER };