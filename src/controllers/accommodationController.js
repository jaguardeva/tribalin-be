import db from "../../config/database.js";

export const getAllAccommodations = (req, res) => {
  const query = "SELECT * FROM accommodations"; // Deklarasi dengan const

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

    // Kirim respon sukses
    res.status(200).json({
      status: 200,
      success: true,
      message: "OK",
      data: datas,
    });
  });
};
export const getAccommodationById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM accommodations where id = ${id}`; // Deklarasi dengan const

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
        message: "Accommodation not found",
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

export const createAccommodation = (req, res) => {
  const { name, description, price, place } = req.body;

  const query =
    "INSERT INTO accommodations (name, description, price, place) VALUES (?, ?, ?, ?)";
  const values = [name, description, price, place];

  db.query(query, values, (err, datas) => {
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
      message: "Accommodation created successfully",
      data: datas,
    });
  });
};

export const editAccommodationById = (req, res) => {
  const { name, description, price, place } = req.body;
  const id = req.params.id;

  const query =
    "UPDATE accommodations SET name = ?, description = ?, price = ?, place = ? WHERE id = ?";
  const values = [name, description, price, place, id];

  db.query(query, values, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    res.status(201).json({
      status: 201,
      success: true,
      message: "Update accommodation successfully",
      data: datas,
    });
  });

  db.query(query, values, (err, datas) => {
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
      message: "Update accommodation successfully",
      data: datas,
    });
  });
};

export const deleteAccommodationById = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM accommodations WHERE id = ${id}`;

  db.query(query, (err, datas) => {
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
      message: "Delete accommodation successfully",
    });
  });
};


export const createSpecification = (req, res) => {
  const { name, count, accommodation_id } = req.body;
  const createdAt = new Date();
  const updatedAt = createdAt;

  // Validasi apakah accommodation_id ada di tabel accommodations
  const checkQuery = "SELECT id FROM accommodations WHERE id = ?";
  db.query(checkQuery, [accommodation_id], (err, results) => {
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

    // Jika validasi lolos, tambahkan data ke tabel specification
    const insertQuery =
      "INSERT INTO specification (name, count, accommodation_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
    const values = [name, count, accommodation_id, createdAt, updatedAt];

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
        message: "Specification created successfully",
        data: {
          id: result.insertId,
          name,
          count,
          accommodation_id,
          created_at: createdAt,
          updated_at: updatedAt,
        },
      });
    });
  });
};

export const getSpecificationsByAccommodation = (req, res) => {
  const { accommodation_id } = req.params;

  const query = "SELECT * FROM specification WHERE accommodation_id = ?";
  db.query(query, [accommodation_id], (err, results) => {
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
        message: "No specifications found for the specified accommodation",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: results,
    });
  });
};

export const deleteSpecification = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM specification WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Specification not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Specification deleted successfully",
    });
  });
};

