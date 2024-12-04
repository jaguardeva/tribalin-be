import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  editAccommodationById,
  deleteAccommodationById,
  getAccommodationById,
} from "../controllers/accommodationController.js";
const router = express.Router();

router.get("/accommodations", getAllAccommodations);
router.get("/accommodations/:id", getAccommodationById);
router.post("/accommodations", createAccommodation);
router.put("/accommodations/:id", editAccommodationById);
router.delete("/accommodations/:id", deleteAccommodationById);

export default router;
