import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  editAccommodationById,
  deleteAccommodationById,
} from "../controllers/accommodationController.js";
const router = express.Router();

router.get("/accommodations", getAllAccommodations);
router.post("/accommodations", createAccommodation);
router.put("/accommodations/:id", editAccommodationById);
router.delete("/accommodations/:id", deleteAccommodationById);

export default router;
