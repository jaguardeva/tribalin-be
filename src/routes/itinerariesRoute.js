import express from "express";
import {
  createItinerary,
  getItineraries,
  getItinerariesByIdAndUserId,
  getItinerariesByUserId,
} from "../controllers/itinerariesController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua itineraries - bisa diakses oleh user yang terautentikasi
router.get("/itineraries", verifyToken, getItinerariesByUserId);

router.get("/itineraries/:id", verifyToken, getItinerariesByIdAndUserId);

router.get("/admin/itineraries", verifyToken, adminOnly, getItineraries);

router.post("/itineraries", verifyToken, createItinerary);

export default router;
