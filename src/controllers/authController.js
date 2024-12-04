// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../../config/database.js";
import crypto from "crypto";  // Impor crypto untuk menghasilkan key dinamis

// Setel JWT_EXPIRES_IN sesuai kebutuhan
const JWT_EXPIRES_IN = "3m"; // Token berlaku 3 menit

let STATIC_JWT_SECRET;

export const generateJwtSecret = () => {
    // Jika belum ada secret key, buat satu kali
    if (!STATIC_JWT_SECRET) {
        STATIC_JWT_SECRET = crypto.randomBytes(64).toString("hex");
    }
    return STATIC_JWT_SECRET;
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
            success: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }
    
        // Kirim respon sukses
        res.status(200).json({
          status: 200,
          success: true,
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
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);                  
        const user = users[0];
        
        if (!user) {             
            return res.status(404).json({ message: "User not found." });         
        }          

        const isPasswordValid = await bcrypt.compare(password, user.password);          
        
        if (!isPasswordValid) {             
            return res.status(401).json({ message: "Invalid credentials." });         
        }          

        // Gunakan fungsi generateJwtSecret yang sudah dimodifikasi
        const token = jwt.sign(             
            { id: user.id, role: user.role },             
            generateJwtSecret(), // Sekarang akan selalu menghasilkan key yang sama             
            { expiresIn: JWT_EXPIRES_IN }         
        );          

        res.status(200).json({             
            status: 200,             
            success: true,             
            message: "OK",             
            data: user,             
            token: token         
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
