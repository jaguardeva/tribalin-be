// routes/authRoute.js
import express from "express";
import { register, login, secure } from "../controllers/authController.js"; // Pastikan path benar

const router = express.Router();

router.post("/register", register);  // Menangani pendaftaran
router.post("/login", login);        // Menangani login
router.get("/protected", secure);    // Menangani route yang dilindungi

export default router;
