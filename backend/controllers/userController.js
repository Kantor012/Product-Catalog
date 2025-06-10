import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const db = getDb();

    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = {
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
        isVerified: false,
        verificationToken,
    };

    await db.collection('users').insertOne(newUser);
    await sendVerificationEmail(email, verificationToken);
    console.log(`Verification token for ${email}: ${verificationToken}`);

    res.status(201).json({ message: 'User registered. Please check your email for verification link.' });
});

const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const db = getDb();

    const result = await db.collection('users').findOneAndUpdate(
        { verificationToken: token },
        { $set: { isVerified: true }, $unset: { verificationToken: "" } }
    );

    if (result) {
        res.json({ message: 'Email verified successfully.' });
    } else {
        res.status(400);
        throw new Error('Invalid verification token.');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const db = getDb();
    const user = await db.collection('users').findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if(!user.isVerified) {
            res.status(401);
            throw new Error('Please verify your email first.');
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const db = getDb();
    const userId = req.user._id;

    const user = await db.collection('users').findOne({ _id: userId });

    if (user) {
        const updateData = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
        };

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        await db.collection('users').updateOne({ _id: userId }, { $set: updateData });

        const updatedUser = await db.collection('users').findOne({ _id: userId });

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id.toString()),
        });

    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const db = getDb();
    const users = await db.collection('users').find({}).project({ password: 0, verificationToken: 0 }).toArray();
    res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
    const db = getDb();
    const userId = new ObjectId(req.params.id);
    const user = await db.collection('users').findOne({ _id: userId }, { projection: { password: 0, verificationToken: 0 } });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const db = getDb();
    const userId = new ObjectId(req.params.id);
    const user = await db.collection('users').findOne({ _id: userId });

    if(user && user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete admin user');
    }

    const result = await db.collection('users').deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const db = getDb();
    const userId = new ObjectId(req.params.id);
    const { name, email, isAdmin } = req.body;

    if (isAdmin === false) {
        const userToEdit = await db.collection('users').findOne({ _id: userId });

        // isAdmin?
        if (userToEdit && userToEdit.isAdmin) {
            const adminCount = await db.collection('users').countDocuments({ isAdmin: true });
            if (adminCount <= 1) {
                res.status(400);
                throw new Error('Cannot remove admin status from the last administrator.');
            }
        }
    }

    const updateData = { name, email, isAdmin };

    await db.collection('users').updateOne({ _id: userId }, { $set: updateData });
    const updatedUser = await db.collection('users').findOne({ _id: userId }, { projection: { password: 0, verificationToken: 0 } });

    res.json(updatedUser);
});

const createUserByAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const db = getDb();

    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        isVerified: true,
    };

    const result = await db.collection('users').insertOne(newUser);
    const createdUser = await db.collection('users').findOne({_id: result.insertedId}, { projection: { password: 0, verificationToken: 0 } });
    res.status(201).json(createdUser);
});

export {
    registerUser,
    loginUser,
    verifyUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserProfile,
    createUserByAdmin,
};