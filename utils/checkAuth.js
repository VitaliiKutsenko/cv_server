const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_ACCESS_TOKEN
            );
            req.userId = decodedToken.id;
            req.username = decodedToken.username;
            req.userStatus = true;

            next();
        } catch (error) {
            return res.status(403).json({
                data: error,
                message: 'No data access!',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No data access!',
        });
    }
};
module.exports = checkAuth;
