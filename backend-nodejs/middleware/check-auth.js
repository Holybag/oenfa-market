const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log('headers authorization:', req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
        console.log('token:', token);
        //const decoded = jwt.verify(token, process.env.JWT_KEY);
        const decoded = jwt.verify(token, "oenfa2020");
        req.userData = decoded;
        next();
    } catch (error) {
        console.log('error:', error);
        return res.status(401).json({
            success: false,
            message: 'Auth failed',
            error: error,
            data: null
        })
    }    
};