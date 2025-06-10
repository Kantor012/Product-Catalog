import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';

const getRecentlyAdded = asyncHandler(async (req, res) => {
    const db = getDb();

    const recentlyAddedItems = await db.collection('recentlyAdded').aggregate([
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        { $unwind: '$productDetails' },
        { $replaceRoot: { newRoot: '$productDetails' } }
    ]).toArray();

    res.json(recentlyAddedItems);
});

export { getRecentlyAdded };