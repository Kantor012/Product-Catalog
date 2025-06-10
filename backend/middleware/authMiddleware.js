import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';
import config from '../config/index.js';
import { ObjectId } from 'mongodb';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    const db = getDb();

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);

            const user = await db.collection('users').findOne(
                { _id: new ObjectId(decoded.id) },
                { projection: { password: 0, verificationToken: 0 } }
            );

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };