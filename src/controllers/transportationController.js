import db from "../../config/database.js";

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
  const { name, description, type, price, location, image_url } = req.body;
  const { id } = req.params;
  const updatedAt = new Date();
  const query = `UPDATE transportations SET name = ?, description = ?, type = ?, price = ?, location = ?, image_url = ?, updated_at = ? WHERE id = ?`;
  const values = [
    name,
    description,
    type,
    price,
    location,
    image_url,
    updatedAt,
    id,
  ];

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

    res.status(201).json({
      status: 201,
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
