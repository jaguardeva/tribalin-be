// routes/authRoute.js
import express from "express";
import { register, login, secure, logout, editUser } from "../controllers/authController.js"; // Pastikan path benar
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);  // Menangani pendaftaran
router.post("/login", login);        // Menangani login
router.get("/protected", secure);    // Menangani route yang dilindungi
router.post("/logout", logout);    // Menangani route yang dilindungi
router.put("/editUser/:id", verifyToken, editUser); 

export default router;
