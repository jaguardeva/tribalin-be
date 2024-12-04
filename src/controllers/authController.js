// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../../config/database.js";
import crypto from "crypto";  // Impor crypto untuk menghasilkan key dinamis

// Setel JWT_EXPIRES_IN sesuai kebutuhan
const JWT_EXPIRES_IN = "3m"; // Token berlaku 3 menit

// Fungsi untuk membuat secret key dinamis menggunakan crypto
const generateJwtSecret = () => {
    return crypto.randomBytes(64).toString("hex");  // Menghasilkan key acak 64 byte
};

// Register
export const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const role = "user"; // Default role
    const values = [name, email, hashedPassword, role]

    db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",values, (err, datas) => {
        if (err) {
          // Kirim respon jika ada error
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
          });
        }
    
        // Kirim respon sukses
        res.status(200).json({
          status: 200,
          message: "OK",
          data: datas,
        });
      });
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Use promise-based query method
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        
        // Check if user exists
        const user = users[0];
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Create JWT with dynamic secret key
        const token = jwt.sign(
            { id: user.id, role: user.role },
            generateJwtSecret(), // Use dynamic secret key
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Send successful response with user data and token
        res.status(200).json({
            status: 200,
            message: "OK",
            data: user,
            token: token
        });
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Protected route (optional, untuk admin/user)
export const secure = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const secret = generateJwtSecret();  // Generate secret key dinamis untuk verifikasi

        const decoded = jwt.verify(token, secret);  // Gunakan secret dinamis untuk verifikasi token
        req.user = decoded; // Simpan info user pada request
        res.status(200).json({ message: "Access granted.", user: decoded });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
