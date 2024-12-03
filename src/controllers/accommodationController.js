import db from "../../config/database.js";

export const getAllAccommodations = (req, res) => {
  const query = "SELECT * FROM accommodations"; // Deklarasi dengan const

  db.query(query, (err, datas) => {
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

export const createAccommodation = (req, res) => {
  const { name, description, price, place } = req.body;

  const query =
    "INSERT INTO accommodations (name, description, price, place) VALUES (?, ?, ?, ?)";
  const values = [name, description, price, place];

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
        message: "Internal Server Error",
        error: err.message,
      });
    }

    res.status(201).json({
      status: 201,
      message: "Delete accommodation successfully",
    });
  });
};
