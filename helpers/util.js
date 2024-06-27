// Authentication regarding Catch error handling
function authError(res, message) {
    return res.status(500).json({error: message})
}

// apis catch error handling
function serverError(error, res) {
    return res.status(500).json({error: "Internal Server Error", errordata: error});
};


export { serverError, authError };