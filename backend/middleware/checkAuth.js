const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    } else {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                throw new Error('Authentication failed.');
            }

            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            req.userId = decodedToken.userId;
            next();
        } catch(err) {
            return res.status(401).json({message: err.message});
        }
    }
};