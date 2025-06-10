import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getAllCategories = asyncHandler(async (req, res) => {
    const db = getDb();
    const categories = await db.collection('categories').find({}).toArray();
    res.json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
    const db = getDb();
    const categoryId = new ObjectId(req.params.id);
    const category = await db.collection('categories').findOne({ _id: categoryId });

    if(category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const db = getDb();

    const categoryExists = await db.collection('categories').findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const result = await db.collection('categories').insertOne({ name });
    const newCategory = await db.collection('categories').findOne({_id: result.insertedId})
    res.status(201).json(newCategory);
});

const updateCategory = asyncHandler(async (req, res) => {
    const db = getDb();
    const categoryId = new ObjectId(req.params.id);
    const { name } = req.body;

    const result = await db.collection('categories').updateOne(
        { _id: categoryId },
        { $set: { name } }
    );

    if (result.matchedCount === 1) {
        const updatedCategory = await db.collection('categories').findOne({ _id: categoryId });
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const db = getDb();
    const categoryId = new ObjectId(req.params.id);

    const productCount = await db.collection('products').countDocuments({ category: categoryId });
    if (productCount > 0) {
        res.status(400);
        throw new Error('Cannot delete category. It is used by existing products.');
    }

    const result = await db.collection('categories').deleteOne({ _id: categoryId });

    if (result.deletedCount === 1) {
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };