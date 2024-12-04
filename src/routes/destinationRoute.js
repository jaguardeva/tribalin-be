import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  editDestinationById,
  deleteDestinationById,
  createDestinationRating,
} from "../controllers/destinationController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua destinasi - bisa diakses oleh user yang terautentikasi
router.get("/destinations", getDestinations);

// GET destinasi berdasarkan ID - bisa diakses oleh user yang terautentikasi
router.get("/destinations/:id", getDestinationById);

// POST destinasi baru - hanya bisa diakses oleh admin
router.post(
  "/destinations",
  verifyToken,
  checkRole("admin"),
  createDestination
);

// PUT edit destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
router.put(
  "/destinations/:id",
  verifyToken,
  checkRole("admin"),
  editDestinationById
);

// // DELETE destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
router.delete(
  "/destinations/:id",
  verifyToken,
  checkRole("admin"),
  deleteDestinationById
);

router.post("/destinations/:id/rating", verifyToken, createDestinationRating);
export default router;
