import db from "../../config/database.js";

export const searchTransportation = (req, res) => {
  const { name, location, type } = req.query;

  // Membuat bagian query dinamis
  const conditions = [];
  const values = [];

  if (name) {
    conditions.push("name LIKE ?");
    values.push(`%${name}%`);
  }

  if (location) {
    conditions.push("location LIKE ?");
    values.push(`%${location}%`);
  }

  if (type) {
    conditions.push("type LIKE ?");
    values.push(`%${type}%`);
  }

  // Jika tidak ada parameter, kembalikan semua data
  const queryBase = "SELECT * FROM transportations";
  const query =
    conditions.length > 0
      ? `${queryBase} WHERE ${conditions.join(" AND ")}`
      : queryBase;

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
        message: "No transportation found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Transportation data retrieved successfully",
      data: datas,
    });
  });
};

export const getTransportations = (req, res) => {
  const query = "SELECT * FROM transportations";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No data available yet",
        data: result,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Get all data transportation successfully",
      data: result,
    });
  });
};

export const getTransportationById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM transportations WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Transportation with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Get data transportation successfully",
      data: result,
    });
  });
};

export const createTransportation = (req, res) => {
  const { name, description, type, price, location, image_url } = req.body;
  const createdAt = new Date();
  const updatedAt = createdAt;

  const query = `INSERT INTO transportations (name, description, type, price, location, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    name,
    description,
    type,
    price,
    location,
    image_url,
    createdAt,
    updatedAt,
  ];

  db.query(query, values, (err, result) => {
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
      message: "Create data transportation successfully",
    });
  });
};

export const editTransportationById = (req, res) => {
  const { id } = req.params;
  const updatedAt = new Date();

  // Filter hanya field yang ada di request body
  const fieldsToUpdate = [];
  const values = [];

  const allowedFields = [
    "name",
    "description",
    "type",
    "price",
    "location",
    "image_url",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      fieldsToUpdate.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  }

  // Tambahkan `updated_at` dan `id` ke query
  fieldsToUpdate.push("updated_at = ?");
  values.push(updatedAt, id);

  // Jika tidak ada field yang diupdate, kembalikan error
  if (fieldsToUpdate.length === 1) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No fields to update",
    });
  }

  const query = `UPDATE transportations SET ${fieldsToUpdate.join(
    ", "
  )} WHERE id = ?`;

  db.query(query, values, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (datas.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Transportation with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Transportation updated successfully",
    });
  });
};

export const deleteTransportationById = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM transportations WHERE id = ?`;

  db.query(query, id, (err, result) => {
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
        message: `Transportation with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Delete data transportation successfully",
    });
  });
};
