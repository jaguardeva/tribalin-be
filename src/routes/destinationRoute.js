import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  editDestinationById,
} from "../controllers/destinationController.js";
const router = express.Router();

router.get("/destinations", getDestinations);
router.get("/destinations/:id", getDestinationById);
router.post("/destinations", createDestination);
router.put("/destinations/:id", editDestinationById);
// router.delete("/destinations/:id", deleteAccommodationById);

export default router;
