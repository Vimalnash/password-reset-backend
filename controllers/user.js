import { USER } from "../models/user.js";

// Getting User Data by EmailId
function getUserByEmail(req) {
    return USER.findOne({email: req.body.email});
};

// Getting User Data by Id
function getUserById(id) {
    return USER.findById(id)
};

// Getting User Data by Reset Password hash
function getUserByResetPass(urlquery) {
    return USER.findOne(
        {passwordReset: urlquery}
    )
};

// Update New Password using reset password link
function updatePass(urlquery, hassPass) {
    return USER.updateOne(
        {passwordReset: urlquery},
        {password: hassPass, passwordReset: ""}
    )
};

// New User Creation
function createUser(req, hassPass) {
    return new USER({
        ...req.body,
        password: hassPass
    }).save();
};

// Reset Password String adding
function addResetPassHash(id, resetHash) {
    return USER.updateOne(
        {_id: id},
        {passwordReset: resetHash}
    )
};

export { 
    getUserByEmail, 
    getUserById, 
    createUser, 
    addResetPassHash, 
    getUserByResetPass, 
    updatePass 
}