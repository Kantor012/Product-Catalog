import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import requestLogger from './middleware/requestLogger.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recentlyAddedRoutes from './routes/recentlyAddedRoutes.js';
import config from './config/index.js';

dotenv.config();

const port = config.port;

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recently-added', recentlyAddedRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
};

startServer().then(r => {
    console.log('Server started successfully');
});