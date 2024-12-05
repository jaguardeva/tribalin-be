import express from "express";
import {
    getTransportationBooking,
    getTransportationBookingById,
    createTransportationBooking,
    paymentCallback,
    deleteTransportationBooking
} from "../controllers/transactionTransportationController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/transportationBooking", verifyToken, getTransportationBooking);
router.get(
    "/transportationBooking/:id",
    verifyToken,
    getTransportationBookingById
);
router.post(
    "/transportationBooking/:id/booking",
    verifyToken,
    createTransportationBooking
);
router.post("/transportationBooking/paymentCallback", verifyToken, paymentCallback);
router.delete("/transportationBooking/:id/delete",    // Route untuk delete
    verifyToken, 
    deleteTransportationBooking  // Fungsi delete
);




export default router;
