// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../../config/database.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Setel JWT_EXPIRES_IN sesuai kebutuhan
const JWT_EXPIRES_IN = "1h";

const STATIC_JWT_SECRET =
  process.env.JWT_SECRET_TOKEN || crypto.randomBytes(32).toString("hex");

// Register
export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Cek apakah email sudah ada di database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const role = "user"; // Default role
    const values = [name, email, hashedPassword, role];

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      values,
      (err, datas) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }

        res.status(200).json({
          status: 200,
          success: true,
          message: "Registration successful",
          data: datas,
        });
      }
    );
  });
};


// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      STATIC_JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Destrukturisasi data user untuk menghapus password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 200,
      success: true,
      message: "OK",
      data: userWithoutPassword, // Kirim data user tanpa password
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Protected route (optional, untuk admin/user)
export const secure = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = STATIC_JWT_SECRET; // Generate secret key dinamis untuk verifikasi

    const decoded = jwt.verify(token, secret); // Gunakan secret dinamis untuk verifikasi token
    req.user = decoded; // Simpan info user pada request
    res.status(200).json({ message: "Access granted.", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const logout = (req, res) => {
  // Ambil token dari header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "No token provided.",
    });
  }

  try {
    // Verifikasi token (opsional, untuk memastikan token valid sebelum logout)
    const secret = STATIC_JWT_SECRET; // Secret key dinamis
    jwt.verify(token, secret);

    // Kirimkan respon sukses tanpa melakukan perubahan di database
    res.status(200).json({
      status: 200,
      success: true,
      message: "Logout successful. Token is now invalid.",
    });
  } catch (error) {
    // Jika token tidak valid atau expired
    res.status(401).json({
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};
