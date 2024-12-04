import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
} from "../controllers/destinationController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET semua destinasi - bisa diakses oleh user yang terautentikasi
router.get("/destinations", 
  verifyToken, 
  getDestinations
);

// GET destinasi berdasarkan ID - bisa diakses oleh user yang terautentikasi
router.get("/destinations/:id", 
  verifyToken, 
  getDestinationById
);

// POST destinasi baru - hanya bisa diakses oleh admin
router.post("/destinations", 
  verifyToken, 
  checkRole(['admin']), 
  createDestination
);

// // PUT edit destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
// router.put("/destinations/:id", 
//   verifyToken, 
//   checkRole(['admin']), 
//   editDestinationById
// );

// // DELETE destinasi - hanya bisa diakses oleh admin (uncomment jika dibutuhkan)
// router.delete("/destinations/:id", 
//   verifyToken, 
//   checkRole(['admin']), 
//   deleteDestinationById
// );

export default router;
