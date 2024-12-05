import express from "express";
import {
  createItinerary,
  getItineraries,
  getItinerariesById,
} from "../controllers/itinerariesController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua itineraries - bisa diakses oleh user yang terautentikasi
router.get("/itineraries", verifyToken, getItineraries);
router.get("/itineraries/:id", verifyToken, getItinerariesById);
router.post("/itineraries", verifyToken, createItinerary);

export default router;
