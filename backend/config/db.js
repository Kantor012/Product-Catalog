import { MongoClient } from 'mongodb';
import config from './index.js';

let db;
let client;

const connectDB = async () => {
    if (db) {
        return;
    }
    try {
        client = new MongoClient(config.databaseUrl, {});
        await client.connect();
        db = client.db('mongo-catalog');
        const recentlyAddedCollection = db.collection('recentlyAdded');
        try {
            await recentlyAddedCollection.dropIndex("createdAt_1");
        } catch (err) {
            if (err.codeName !== 'IndexNotFound') throw err;
        }
        await recentlyAddedCollection.createIndex(
            { createdAt: 1 },
            { expireAfterSeconds: 300 }
        );
        const productsCollection = db.collection('products');
        try {
            await productsCollection.dropIndex("ProductTextIndex");
        } catch (err) {
            if (err.codeName !== 'IndexNotFound') throw err;
        }
        await productsCollection.createIndex(
            {
                "$**": "text" // wildcard text index
            },
            {
                name: "ProductTextIndex"
            }
        );

    } catch (err) {
        console.error("Error during DB initialization:", err.message);
        process.exit(1);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized! Call connectDB first.');
    }
    return db;
};

export { connectDB, getDb };