import express from 'express';
// controllers
import api from '../controllers/livreur24.js';

const router = express.Router();

router
  .get('/restaurant', api.menusOfrestaurant)
  .post('/restaurant', api.menusOfrestaurant)

export default router;
