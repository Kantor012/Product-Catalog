import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
    });
};

export default generateToken;