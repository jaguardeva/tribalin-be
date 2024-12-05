import db from "../../config/database.js";

export const getAccommodationBooking = (req, res) => {
    const query = "SELECT * FROM accommodation_booking"; // Deklarasi dengan const

    db.query(query, (err, datas) => {
        if (err) {
            res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
  
        res.status(200).json({
            status: 200,
            success: true,
            message: "OK",
            data: datas,
            });
    });
};

export const getAccommodationBookingById = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM accommodation_booking where id = ${id}`; // Deklarasi dengan const
  
    db.query(query, (err, datas) => {
        if (err) {
            // Kirim respon jika ada error
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
  
        if (datas.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Accommodation booking not found",
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

export const createAccommodationBooking = (req, res) => {
    const { check_in, check_out, perday } = req.body;
    const user_id = req.user.id; // Pastikan req.user sudah diisi oleh middleware auth
    const accommodation_id = req.params.id;
    const createdAt = new Date();
    const status = "pending"; // Status awal

    // Validasi input
    if (!check_in || !check_out || !perday || !accommodation_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Bad Request: Missing required fields",
        });
    }

    // Ambil harga dari tabel accommodations
    const getPriceQuery = "SELECT price FROM accommodations WHERE id = ?";
    db.query(getPriceQuery, [accommodation_id], (err, results) => {
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
                message: "Accommodation not found",
            });
        }

        const price = results[0].price;
        const total = perday * price; // Hitung total berdasarkan input perday

        // Masukkan booking ke tabel accommodation_booking
        const insertQuery =
            "INSERT INTO accommodation_booking (accommodation_id, user_id, check_in, check_out, perday, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            accommodation_id,
            user_id,
            check_in,
            check_out,
            perday,
            total,
            status,
            createdAt,
        ];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: err.message,
                });
            }

            res.status(201).json({
                status: 201,
                success: true,
                message: "Accommodation booking created successfully",
                data: {
                    id: result.insertId, // Dapatkan ID yang baru dimasukkan
                    accommodation_id,
                    user_id,
                    check_in,
                    check_out,
                    perday,
                    total,
                    status,
                    created_at: createdAt,
                },
            });
        });
    });
};

