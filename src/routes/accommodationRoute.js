import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  editAccommodationById,
  deleteAccommodationById,
  getAccommodationById,
} from "../controllers/accommodationController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/accommodations", getAllAccommodations);
router.get("/accommodations/:id", getAccommodationById);
router.post(
  "/accommodations",
  verifyToken,
  checkRole("admin"),
  createAccommodation
);
router.put(
  "/accommodations/:id/edit",
  verifyToken,
  checkRole("admin"),
  editAccommodationById
);
router.delete(
  "/accommodations/:id",
  verifyToken,
  checkRole("admin"),
  deleteAccommodationById
);

export default router;
