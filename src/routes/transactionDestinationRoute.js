import express from "express";
import {
    getDestinationBooking,
    getDestinationBookingById,
    createDestinationBooking,
    destinationPaymentCallback,
    deleteDestinationBooking
} from "../controllers/transactionDestinationController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/destinationBooking", getDestinationBooking);
router.get(
    "/destinationBooking/:id",
    verifyToken,
    getDestinationBookingById
);
router.post(
    "/destinationBooking/:id/booking",
    verifyToken,
    createDestinationBooking
);

router.post("/destinationBooking/paymentCallback", destinationPaymentCallback);

router.delete("/destinationBooking/:id",    // Route untuk delete
    verifyToken, 
    deleteDestinationBooking  // Fungsi delete
);


export default router;
