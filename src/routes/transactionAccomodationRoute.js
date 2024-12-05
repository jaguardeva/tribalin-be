import express from "express";
import {
    getAccommodationBooking,
    getAccommodationBookingById,
    createAccommodationBooking,
    paymentCallback,
    deleteAccommodationBooking
} from "../controllers/transactionAccomodationController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/accommodationBooking", verifyToken, getAccommodationBooking);

router.get(
  "/accommodationBooking/:id",
  verifyToken,
  getAccommodationBookingById
);

router.post(
  "/accommodationBooking/:id/booking",
  verifyToken,
  createAccommodationBooking
);
router.post("/accommodationBooking/paymentCallback", paymentCallback);

router.delete("/accommodationBooking/:id",    // Route untuk delete
    verifyToken, 
    deleteAccommodationBooking  // Fungsi delete
);

export default router;
