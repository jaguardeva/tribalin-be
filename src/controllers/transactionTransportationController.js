import db from "../../config/database.js";


export const getTransportationBooking = (req, res) => {
    const { role, id: userId } = req.user; // Ambil informasi user dari req.user
    
    // Query dasar
    let query = "SELECT * FROM transportation_booking";
    const values = [];
  
    // Jika role adalah "user", tambahkan filter untuk user_id
    if (role === "user") {
      query += " WHERE user_id = ?";
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
        // Kirim respon jika tidak ada data
        return res.status(404).json({
          status: 404,
          success: false,
          message: "No transportation bookings found",
        });
      }
  
      // Kirim respon sukses dengan data
      res.status(200).json({
        status: 200,
        success: true,
        message: "Transportation bookings retrieved successfully",
        data: datas,
      });
    });
};


export const getTransportationBookingById = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM transportation_booking where id = ${id}`; // Deklarasi dengan const
  
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
                message: "Transportation booking not found",
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

const generateBookingId = (type) => {
    const randomPart = new Date().getTime().toString().slice(-6); // Ambil 6 digit terakhir dari timestamp
    let bookingId = '';

    switch(type) {
        case 'car': 
            bookingId = `CAR-${randomPart}`; 
            break;
        case 'motor': 
            bookingId = `MTR-${randomPart}`; 
            break;
        case 'bike': 
            bookingId = `BKE-${randomPart}`; 
            break;
        default:
            throw new Error('Unknown transportation type');
    }

    return bookingId;
};

export const createTransportationBooking = (req, res) => {
    const { check_in, check_out } = req.body;
    const user_id = req.user.id;
    const transportation_id = req.params.id;
    const createdAt = new Date();
    const status = "pending";

    if (!check_in || !check_out || !transportation_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Bad Request: Missing required fields",
        });
    }

    // Query untuk mengambil tipe akomodasi
    const getTypeQuery = "SELECT type FROM transportations WHERE id = ?";
    db.query(getTypeQuery, [transportation_id], (err, results) => {
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
                message: "Transportation not found",
            });
        }

        const type = results[0].type;
        const booking_id = generateBookingId(type); // Menghasilkan booking_id berdasarkan tipe

        const getPriceQuery = "SELECT price FROM transportations WHERE id = ?";
        db.query(getPriceQuery, [transportation_id], (err, results) => {
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
                    message: "Transportation not found",
                });
            }

            const price = results[0].price;
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
                "INSERT INTO transportation_booking (booking_id, transportation_id, user_id, check_in, check_out, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [
                booking_id,
                transportation_id,
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
                    message: "Transportation booking created successfully",
                    data: {
                        id: result.insertId,
                        booking_id,
                        transportation_id,
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
    });
};

const mapPaymentStatusToBookingStatus = (paymentStatus) => {
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

export const paymentCallback = (req, res) => {
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
    const mappedStatus = mapPaymentStatusToBookingStatus(status);

    // Perbarui status di database berdasarkan booking_id
    const updateQuery =
        "UPDATE transportation_booking SET status = ? WHERE booking_id = ?";
    db.query(updateQuery, [mappedStatus, booking_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }

        // Jika tidak ada row yang terupdate, artinya booking_id tidak ditemukan
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Payment status updated successfully",
        });
    });
};

export const deleteTransportationBooking = (req, res) => {
    const { id } = req.params; // Gunakan id sebagai parameter URL

    // Query untuk menghapus booking berdasarkan id
    const deleteQuery = "DELETE FROM transportation_booking WHERE id = ?";
    
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
            message: "Transportation booking deleted successfully",
        });
    });
};