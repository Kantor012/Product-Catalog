import express from 'express';
import { getRecentlyAdded } from '../controllers/recentlyAddedController.js';

const router = express.Router();

router.route('/').get(getRecentlyAdded);

export default router;