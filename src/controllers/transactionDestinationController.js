import db from "../../config/database.js";


// Destination Booking
export const getDestinationBooking = (req, res) => {
    const { role, id: userId } = req.user; // Asumsikan informasi user tersedia di `req.user`
  
    // Query dasar untuk admin dan user
    let query = "SELECT * FROM destination_booking";
    const values = [];
  
    // Jika role adalah "user", tambahkan filter untuk user_id
    if (role === "user") {
      query += " WHERE user_id = ?";
      values.push(userId);
    }
  
    // Eksekusi query
    db.query(query, values, (err, datas) => {
      if (err) {
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
          message: "No destination bookings found",
        });
      }
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Destination bookings retrieved successfully",
        data: datas,
      });
    });
};


export const getDestinationBookingById = (req, res) => {
    const { id } = req.params; // ID booking yang diminta
    const { role, id: userId } = req.user; // Informasi user dari req.user
  
    // Query dasar
    let query = "SELECT * FROM destination_booking WHERE id = ?";
    const values = [id];
  
    // Jika role adalah "user", tambahkan filter untuk user_id
    if (role === "user") {
      query += " AND user_id = ?";
      values.push(userId);
    }
  
    db.query(query, values, (err, datas) => {
      if (err) {
        // Kirim respon jika terjadi error
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
  
      if (datas.length === 0) {
        // Kirim respon jika data tidak ditemukan
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Destination booking not found",
        });
      }
  
      // Kirim respon sukses
      res.status(200).json({
        status: 200,
        success: true,
        message: "Destination booking retrieved successfully",
        data: datas[0], // Ambil data pertama karena ID bersifat unik
      });
    });
};
  


export const createDestinationBooking = (req, res) => {
    const { check_in, check_out } = req.body;
    const user_id = req.user.id;
    const destination_id = req.params.id;
    const createdAt = new Date();
    const status = "pending";

    if (!check_in || !check_out || !destination_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Bad Request: Missing required fields",
        });
    }

    const getPriceQuery = "SELECT price FROM destinations WHERE id = ?";
    db.query(getPriceQuery, [destination_id], (err, results) => {
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
                message: "Destination not found",
            });
        }

        const price = results[0].price;

        // Generate booking_id dengan awalan 'DST-' dan bagian acak dari timestamp
        const randomPart = new Date().getTime().toString().slice(-6); // Ambil 6 digit terakhir dari timestamp
        const booking_id = `DST-${randomPart}`;

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        // Hitung durasi dalam hari
        const perday = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        if (perday <= 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid dates: check-out must be after check-in",
            });
        }

        // Hitung total
        const total = perday * price;

        const insertQuery =
            "INSERT INTO destination_booking (booking_id, destination_id, user_id, check_in, check_out, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            booking_id,
            destination_id,
            user_id,
            check_in,
            check_out,
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
                message: "Destination booking created successfully",
                data: {
                    id: result.insertId,
                    booking_id,
                    destination_id,
                    user_id,
                    check_in,
                    check_out,
                    total,
                    status,
                    created_at: createdAt,
                },
            });
        });
    });
};

const mapPaymentStatusToBooking = (paymentStatus) => {
    switch (paymentStatus) {
        case "success":
        case "paid":
            return "confirmed";
        case "failed":
            return "cancelled";
        default:
            return "pending";
    }
};

export const destinationPaymentCallback = (req, res) => {
    const { booking_id, status } = req.body;

    // Validasi input
    if (!booking_id || !status) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Bad Request: Missing required fields",
        });
    }

    // Mapping status dari payment gateway ke status booking
    const mappedStatus = mapPaymentStatusToBooking(status);

    // Perbarui status di database berdasarkan booking_id
    const updateQuery = "UPDATE destination_booking SET status = ? WHERE booking_id = ?";

    db.query(updateQuery, [mappedStatus, booking_id], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: err.message,
                debugInfo: {
                    query: updateQuery,
                    params: [mappedStatus, booking_id]
                },
            });
        }

        // Jika tidak ada row yang terupdate, artinya booking_id tidak ditemukan
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Booking not found",
                bookingId: booking_id
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Payment status updated successfully",
        });
    });
};

export const deleteDestinationBooking = (req, res) => {
    const { id } = req.params; // Gunakan id sebagai parameter URL

    // Query untuk menghapus booking berdasarkan id
    const deleteQuery = "DELETE FROM destination_booking WHERE id = ?";
    
    // Jalankan query untuk menghapus data berdasarkan id
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }

        // Jika tidak ada data yang dihapus
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Booking not found",
            });
        }

        // Jika berhasil menghapus
        res.status(200).json({
            status: 200,
            success: true,
            message: "Destination booking deleted successfully",
        });
    });
};










