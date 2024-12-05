import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  editDestinationById,
  deleteDestinationById,
  createDestinationRating,
  getDestiantionRating,
  getDestinationRatingById,
  deleteDestinationRatingById,
} from "../controllers/destinationController.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua destinasi - bisa diakses oleh user yang terautentikasi
router.get("/destinations", getDestinations);

// GET destinasi berdasarkan ID - bisa diakses oleh user yang terautentikasi
router.get("/destinations/:id", getDestinationById);

// POST destinasi baru - hanya bisa diakses oleh admin
router.post("/destinations", verifyToken, adminOnly, createDestination);

// PUT edit destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
router.put(
  "/destinations/:id/edit",
  verifyToken,
  adminOnly,
  editDestinationById
);

// // DELETE destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
router.delete(
  "/destinations/:id/delete",
  verifyToken,
  adminOnly,
  deleteDestinationById
);

router.post("/destinations/:id/ratings", verifyToken, createDestinationRating);
router.get("/destinations/:id/ratings", getDestiantionRating);
router.get("/destinations/ratings/:id", getDestinationRatingById);
router.delete(
  "/destinations/ratings/:id/delete",
  verifyToken,
  adminOnly,
  deleteDestinationRatingById
);
export default router;
