import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  editAccommodationById,
  deleteAccommodationById,
  getAccommodationById,
  createSpecification,
  getSpecificationsByAccommodation,
  deleteSpecification
} from "../controllers/accommodationController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/accommodations", getAllAccommodations);
router.get("/accommodations/:id", getAccommodationById);
router.post("/accommodations", verifyToken, adminOnly, createAccommodation);
router.put(
  "/accommodations/:id/edit",
  verifyToken,
  adminOnly,
  editAccommodationById
);
router.delete(
  "/accommodations/:id",
  verifyToken,
  adminOnly,
  deleteAccommodationById
);

//Spesification
router.get("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  getSpecificationsByAccommodation
);
router.post("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  createSpecification
);
router.delete("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  deleteSpecification
);

export default router;
