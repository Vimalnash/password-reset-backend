import jwt from "jsonwebtoken";

// Generate New Token
function generateToken(id) {
    return jwt.sign({id}, process.env.SECRET_KEY);
};

// Verifying Token
function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
};


export { generateToken, verifyToken };