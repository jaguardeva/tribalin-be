import express from "express";
import {
  getTransportations,
  getTransportationById,
  searchTransportation,
  createTransportation,
  editTransportationById,
  deleteTransportationById,
} from "../controllers/transportationController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/transportations", getTransportations);
router.get("/transportations/search", searchTransportation);
router.get("/transportations/:id", getTransportationById);
router.post("/transportations", verifyToken, adminOnly, createTransportation);
router.put("/transportations/:id/edit", verifyToken, adminOnly, editTransportationById);
router.delete(
  "/transportations/:id/delete",
  verifyToken, 
  adminOnly,
  deleteTransportationById
);

export default router;
