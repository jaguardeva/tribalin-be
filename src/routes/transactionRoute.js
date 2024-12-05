import express from "express";
import {
    getAccommodationBooking,
    getAccommodationBookingById,
    createAccommodationBooking
} from "../controllers/transactionController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/accommodationBooking",    
    verifyToken,
    getAccommodationBooking
);

router.get("/accommodationBooking/:id",    
    verifyToken,
    getAccommodationBookingById
);

router.post("/accommodationBooking/:id/booking",    
    verifyToken,
    createAccommodationBooking
);


export default router;
