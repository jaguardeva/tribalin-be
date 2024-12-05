import express from "express";
import {
  createItinerary,
  getItineraries,
  getItinerariesById,
  deleteItineraryById
} from "../controllers/itinerariesController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua itineraries - bisa diakses oleh user yang terautentikasi
router.get("/itineraries", verifyToken, getItineraries);
router.get("/itineraries/:id", verifyToken, getItinerariesById);
router.post("/itineraries", verifyToken, createItinerary);
router.delete("/itineraries/:id/delete", verifyToken, deleteItineraryById);

export default router;
