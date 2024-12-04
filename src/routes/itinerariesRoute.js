import express from "express";
import {
    getItineraries
} from "../controllers/itinerariesController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();


// GET semua itineraries - bisa diakses oleh user yang terautentikasi
router.get("/itineraries",    
    verifyToken,
    checkRole("admin"),
    getItineraries
);


export default router;
