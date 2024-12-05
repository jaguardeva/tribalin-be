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
  const { name, email, password, confirmPassword, tanggal_lahir, phone } = req.body;

  // Validasi untuk memastikan semua field diperlukan ada
  if (!name || !email || !password || !confirmPassword || !tanggal_lahir || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validasi password dan konfirmasi password
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Cek apakah email sudah ada di database
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
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

      // Ambil waktu saat ini untuk created_at
      const createdAt = new Date();

      // Simpan ke database dengan tambahan tanggal_lahir dan phone
      const role = "user"; // Default role
      const values = [name, email, hashedPassword, role, tanggal_lahir, phone, createdAt];

      db.query(
        "INSERT INTO users (name, email, password, role, tanggal_lahir, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
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

          // Mengembalikan response sukses dengan data user yang baru
          res.status(200).json({
            status: 200,
            success: true,
            message: "Registration successful",
            data: {
              id: datas.insertId,
              name,
              email,
              role,
              tanggal_lahir,
              phone,
              created_at: createdAt
            },
          });
        }
      );
    }
  );
};

export const editUser = async (req, res) => {
  const { id } = req.params; // ID pengguna yang akan diupdate
  const { name, email, tanggal_lahir, phone, role } = req.body; // Field yang dapat diupdate

  // Validasi jika tidak ada field yang diinputkan
  if (!name && !email && !tanggal_lahir && !phone && !role) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "At least one field must be provided for update.",
    });
  }

  // Ambil waktu saat ini untuk updated_at
  const updatedAt = new Date();

  // Query untuk memeriksa apakah user dengan id tersebut ada
  db.query("SELECT * FROM users WHERE id = ?", [id], async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    const user = results[0]; // Mendapatkan data pengguna yang ada

    // Jika role ingin diubah, pastikan role lama adalah admin
    if (role && user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You are not authorized to change the role.",
      });
    }

    // Jika email ingin diubah, pastikan email baru tidak sama dengan yang ada di database
    if (email && email !== user.email) {
      // Cek jika email sudah ada di database
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, emailCheckResults) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }

        if (emailCheckResults.length > 0) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "Email is already registered.",
          });
        }

        // Lanjutkan ke update email
        updateUser();
      });
    } else {
      // Jika email tidak berubah, langsung update user
      updateUser();
    }

    // Fungsi untuk melakukan update user
    function updateUser() {
      const updateFields = [];
      const updateValues = [];

      // Menambahkan field yang ingin diupdate ke query
      if (name) {
        updateFields.push("name = ?");
        updateValues.push(name);
      }
      if (email && email !== user.email) {
        updateFields.push("email = ?");
        updateValues.push(email);
      }
      if (tanggal_lahir) {
        updateFields.push("tanggal_lahir = ?");
        updateValues.push(tanggal_lahir);
      }
      if (phone) {
        updateFields.push("phone = ?");
        updateValues.push(phone);
      }
      if (role) {
        updateFields.push("role = ?");
        updateValues.push(role);
      }

      // Menambahkan updated_at ke query
      updateFields.push("updated_at = ?");
      updateValues.push(updatedAt);

      // Menambahkan ID user ke query untuk update
      updateValues.push(id);

      // Membuat query update dengan field yang ingin diperbarui
      const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

      db.query(updateQuery, updateValues, (err, results) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }

        // Response sukses setelah data diupdate
        res.status(200).json({
          status: 200,
          success: true,
          message: "User updated successfully",
          data: {
            id,
            name,
            email: email || user.email,
            tanggal_lahir,
            phone,
            role,
            updated_at: updatedAt, // Menambahkan updated_at di response
          },
        });
      });
    }
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
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect!" });
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
