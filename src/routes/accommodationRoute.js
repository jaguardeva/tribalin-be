import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  searchAccommodations,
  editAccommodationById,
  deleteAccommodationById,
  getAccommodationById,
  createSpecification,
  updateSpecification,
  deleteSpecification
} from "../controllers/accommodationController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/accommodations/search", searchAccommodations);
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
  "/accommodations/:id/delete",
  verifyToken,
  adminOnly,
  deleteAccommodationById
);

//Spesification
router.post("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  createSpecification
);
router.put("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  updateSpecification
);
router.delete("/accommodations/spesification/:id",   
  verifyToken,
  adminOnly,
  deleteSpecification
);

export default router;
