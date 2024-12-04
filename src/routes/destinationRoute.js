import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
} from "../controllers/destinationController.js";
const router = express.Router();

router.get("/destinations", getDestinations);
router.get("/destinations/:id", getDestinationById);
router.post("/destinations", createDestination);
// router.put("/destinations/:id", editAccommodationById);
// router.delete("/destinations/:id", deleteAccommodationById);

export default router;
