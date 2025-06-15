import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

const generateSearchableString = (details) => {
    if (!details || typeof details !== 'object') {
        return '';
    }
    return Object.values(details).join(' ');
};

const fullProductAggregation = [
    {
        $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category_details'
        }
    },
    {
        $unwind: {
            path: '$category_details',
            preserveNullAndEmptyArrays: true
        }
    }
];

const searchProducts = asyncHandler(async (req, res) => {
    const db = getDb();
    const { keyword, category, minPrice, maxPrice, sort } = req.query;
    const initialMatchQuery = {};

    if (keyword) {
        initialMatchQuery.$text = { $search: keyword };
    }

    if (category) {
        try {
            initialMatchQuery.category = new ObjectId(category);
        } catch (error) {
            console.warn(`Invalid category ID received: ${category}`);
        }
    }

    const pipeline = [
        { $match: initialMatchQuery },
        {
            $addFields: {
                effectivePrice: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$isPromotional", true] },
                                { $ne: ["$promotionalPrice", null] }
                            ]
                        },
                        then: { $toDouble: "$promotionalPrice" },
                        else: "$price"
                    }
                }
            }
        }
    ];

    const priceMatchQuery = {};
    if (minPrice && !isNaN(Number(minPrice))) {
        priceMatchQuery.$gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
        priceMatchQuery.$lte = Number(maxPrice);
    }
    if (Object.keys(priceMatchQuery).length > 0) {
        pipeline.push({ $match: { effectivePrice: priceMatchQuery } });
    }

    const sortOptions = {};
    if (keyword) {
        sortOptions.score = { $meta: "textScore" };
    }

    if (sort) {
        const [field, order] = sort.split('_');
        const sortOrder = order === 'asc' ? 1 : -1;
        if (field === 'price') {
            sortOptions.effectivePrice = sortOrder;
        } else if (field) {
            sortOptions[field] = sortOrder;
        }
    }

    if (Object.keys(sortOptions).length === 0) {
        sortOptions.createdAt = -1;
    }

    pipeline.push({ $sort: sortOptions });
    pipeline.push(...fullProductAggregation);
    pipeline.push({ $project: { effectivePrice: 0, searchable_details_string: 0 } });

    const products = await db.collection('products').aggregate(pipeline).toArray();
    res.json(products);
});

const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const db = getDb();
    const products = await db.collection('products').aggregate(fullProductAggregation).toArray();
    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const db = getDb();
    const productId = new ObjectId(req.params.id);
    const product = await db.collection('products').aggregate([
        { $match: { _id: productId } },
        ...fullProductAggregation
    ]).next();

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const getPromotionalProducts = asyncHandler(async (req, res) => {
    const db = getDb();
    const products = await db.collection('products').find({ isPromotional: true }).toArray();
    res.json(products);
});

const getRecommendations = asyncHandler(async (req, res) => {
    const db = getDb();
    const productId = new ObjectId(req.params.id);
    const product = await db.collection('products').findOne({ _id: productId });
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    const recommendations = await db.collection('products').find({
        category: product.category,
        _id: { $ne: productId }
    }).limit(5).toArray();
    res.json(recommendations);
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, imageUrl, category, details, isPromotional, promotionalPrice } = req.body;

    const db = getDb();
    const numericPrice = Number(price);
    let categoryName = '';
    const categoryDoc = await db.collection('categories').findOne({ _id: new ObjectId(category) });
    if (categoryDoc) {
        categoryName = categoryDoc.name;
    }
    const brand = name.split(' ')[0] || '';
    let singularCategory;
    switch(categoryName) {
        case 'Smartphones': singularCategory = 'Smartphone'; break;
        case 'TVs': singularCategory = 'TV'; break;
        case 'Laptops': singularCategory = 'Laptop'; break;
        case 'Tablets': singularCategory = 'Tablet'; break;
        case 'Smartwatches': singularCategory = 'Smartwatch'; break;
        case 'Headphones': singularCategory = 'Headphone'; break;
        case 'Smart Home Devices': singularCategory = 'Smart Home'; break;
        default: singularCategory = categoryName;
    }
    const searchTerms = `${singularCategory}+${brand}`;
    const generatedImageUrl = `https://placehold.co/400x300/EFEFEF/333333?text=${searchTerms}`;
    const product = {
        name,
        price: numericPrice,
        description,
        imageUrl: generatedImageUrl,
        category: new ObjectId(category),
        details: details || {},
        isPromotional: isPromotional || false,
        promotionalPrice: (isPromotional && promotionalPrice) ? Number(promotionalPrice) : null,
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        searchable_details_string: generateSearchableString(details),
    };
    const result = await db.collection('products').insertOne(product);
    const newProductWithDetails = await db.collection('products').aggregate([
        { $match: { _id: result.insertedId } },
        ...fullProductAggregation
    ]).next();
    if (newProductWithDetails) {
        await db.collection('recentlyAdded').insertOne({
            product: newProductWithDetails._id,
            createdAt: new Date()
        });
    }
    res.status(201).json(newProductWithDetails);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, imageUrl, category, details, isPromotional, promotionalPrice } = req.body;
    const db = getDb();
    const productId = new ObjectId(req.params.id);
    const numericPrice = Number(price);
    const updateData = {
        name,
        price: numericPrice,
        description,
        imageUrl,
        category: new ObjectId(category),
        details,
        isPromotional,
        promotionalPrice: (isPromotional && promotionalPrice) ? Number(promotionalPrice) : null,
        searchable_details_string: generateSearchableString(details),
    };
    const result = await db.collection('products').updateOne(
        { _id: productId },
        { $set: updateData }
    );
    if (result.matchedCount === 1) {
        const updatedProduct = await db.collection('products').findOne({ _id: productId });
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const db = getDb();
    const productId = new ObjectId(req.params.id);
    await db.collection('recentlyAdded').deleteMany({ product: productId });
    const result = await db.collection('products').deleteOne({ _id: productId });
    if (result.deletedCount === 1) {
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const db = getDb();
    const productId = new ObjectId(req.params.id);
    const product = await db.collection('products').findOne({ _id: productId });
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString() && req.user.isAdmin === false
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            _id: new ObjectId(),
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            createdAt: new Date()
        };
        const newReviews = [...product.reviews, review];
        const newNumReviews = newReviews.length;
        const newRating = newReviews.reduce((acc, item) => item.rating + acc, 0) / newNumReviews;
        await db.collection('products').updateOne(
            { _id: productId },
            {
                $set: {
                    reviews: newReviews,
                    rating: newRating,
                    numReviews: newNumReviews,
                }
            }
        );
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const deleteSingleReview = asyncHandler(async (req, res) => {
    const { id: productId, reviewId } = req.params;
    const db = getDb();

    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== reviewId);

    const numReviews = reviews.length;
    const rating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 1;

    await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $set: { reviews, numReviews, rating } }
    );

    res.status(200).json({ message: 'Review removed' });
});

const deleteAllReviews = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const db = getDb();

    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $set: { reviews: [], numReviews: 0, rating: 0 } }
    );

    res.status(200).json({ message: 'All reviews removed' });
});


const updateProductField = asyncHandler(async (req, res) => {
    const db = getDb();
    const productId = new ObjectId(req.params.id);

    const result = await db.collection('products').updateOne(
        { _id: productId },
        { $set: req.body }
    );

    if (result.matchedCount === 1) {
        const updatedProduct = await db.collection('products').findOne({ _id: productId });
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    createProduct,
    getProductById,
    searchProducts,
    addProductReview,
    getPromotionalProducts,
    getAllProductsAdmin,
    updateProduct,
    deleteProduct,
    getRecommendations,
    deleteSingleReview,
    deleteAllReviews,
    updateProductField
};