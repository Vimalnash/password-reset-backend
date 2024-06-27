import express from "express";
import bcrypt from "bcrypt";
import { serverError } from "../helpers/util.js";
import { addResetPassHash, createUser, getUserByEmail, getUserById, getUserByResetPass, updatePass } from "../controllers/user.js";
import { generateToken } from "../helpers/auth.js";
import { sendEmail } from "../controllers/mailer.js";


const router = express.Router();

// New User Signup
router.post("/signup", async (req, res) => {
    try {
        const existUser = await getUserByEmail(req);
        if(existUser) {
            return res.status(400).json({error: "Already Signed! Try Login"});
        };

        const salt = await bcrypt.genSalt(10);
        const hassPass = await bcrypt.hash(req.body.password, salt);
        const newUser = await createUser(req, hassPass);
        const {userName, email } = newUser;
        return res.status(201).json({message: "Succesfully Signed", data: { userName, email }});
    } catch (error) {
        return serverError(error, res);
    }
});

// Existing User Login
router.post("/login", async(req, res) => {
    try {
        const existUser = await getUserByEmail(req);
        if(!existUser) {
            return res.status(400).json({error: "Invalid Credentials"});
        };
        const verifyPass =await bcrypt.compare(req.body.password, existUser.password);
        if (!verifyPass) {
            return res.status(400).json({error: "Invalid Credentials"});
        };
        const token = generateToken(existUser._id);
        const {userName, email} = existUser ;
        return res.status(400).json({message: "LoggedIn Successfully", token: token, user: {userName, email}});
    } catch (error) {
        return serverError(error, res);
    }
});

// Forgot Password regarding ->
// Verifying email Exist and sending reset link
router.put("/resetpassword", async (req, res) => {
    try {
        const getUser = await getUserByEmail(req);
        if (!getUser) {
            return res.status(400).json({error: "Invalid Credential"});
        };
        
        const salt = await bcrypt.genSalt(5);
        const setResetHash = await bcrypt.hash(getUser.password, salt);
        
        const addResetHash = await addResetPassHash(getUser._id, setResetHash);

        if (!addResetHash) {
            return res.status(400).json({error: "Try After Sometime"});
        };

        const getUpdatedUser = await getUserById(getUser._id);

        const isMailed =await sendEmail(getUpdatedUser.email, getUpdatedUser.passwordReset);

        if (!isMailed) {
            return res.status(400).json({message:"SendingMailFailed! Try After sometime"});
        }
        return res.status(200).json({message: "Check ResetLink in Mail", passwordReset: getUpdatedUser.passwordReset});
    } catch (error) {
        return serverError(error, res);
    }
});

// When User Click Reset Link
// if resetHash string exists return success else error
// based on this user will get new password input page
router.get("/resetpasswordlink", async(req, res) => {
    try {
        const urlquery = req.query.searchquery;

        const resetPassCheck = await getUserByResetPass(urlquery);

        if (!resetPassCheck) {
            return res.status(400).json({error: "Check Connection/Try Again/Get Reset again"});
        }
        return res.status(201).json({message: "SuccesVerifyingYourLink"});

    } catch (error) {
        return serverError(error, res);
    }
});

// Update New Password and setting ResetPassword string null
router.put("/resetpassword/setnewpassword", async(req, res) => {
    try {
        const urlquery = req.query.searchquery;

        const salt = await bcrypt.genSalt(10);
        const hassPass = await bcrypt.hash(req.body.password, salt);

        const updatedRes = await updatePass(urlquery, hassPass);

        if (!updatedRes) {
            return res.status(400).json({error: "Update Failed"});
        }
        return res.status(201).json({message: "Succesfully Updated"});

    } catch (error) {
        return serverError(error, res);
    }
});

export const userRouter = router;
