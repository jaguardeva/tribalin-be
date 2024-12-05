import express from "express";
import {
  getTransportations,
  getTransportationById,
  createTransportation,
  editTransportationById,
  deleteTransportationById,
} from "../controllers/transportationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/transportations", getTransportations);
router.get("/transportations/:id", getTransportationById);
router.post("/transportations", verifyToken, createTransportation);
router.put("/transportations/:id/edit", verifyToken, editTransportationById);
router.delete(
  "/transportations/:id/delete",
  verifyToken,
  deleteTransportationById
);

export default router;
