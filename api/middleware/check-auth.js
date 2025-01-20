//This code is a middleware function for a Node.js/Express application that handles JSON Web Token (JWT) authentication
const jwt = require('jsonwebtoken');//Import the jsonwebtoken library

module.exports = (req, res, next) => { //The middleware is exported so it can be used in routes
    try {
        // Look for token in Authorization header
        const token = req.headers.authorization;
        console.log(token)

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);//The payload (data stored in the token) is decoded and stored in the decoded variable.

        // Attach decoded information to the request object
        req.userData = decoded;

        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }
};
