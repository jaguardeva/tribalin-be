import db from "../../config/database.js";

export const getDestinations = (req, res) => {
  const query = "SELECT * FROM destinations"; // Deklarasi dengan const

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

export const getDestinationById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM destinations where id = ${id}`; // Deklarasi dengan const

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
        message: "Destination not found",
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

export const createDestination = (req, res) => {
  const {
    name,
    description,
    location,
    image_url,
    duration,
    is_freetransport,
    price,
  } = req.body;

  const query =
    "INSERT INTO destinations (name, description, location, image_url, duration, is_freetransport, price, created_at, updated_at) VALUES (?, ?, ?, ?,?,?,?)";
  const values = [
    name,
    description,
    location,
    image_url,
    duration,
    is_freetransport,
    price,
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

    res.status(201).json({
      status: 201,
      success: true,
      message: "Destination created successfully",
      // data: datas,
    });
  });
};

export const editDestinationById = (req, res) => {
  const {
    name,
    description,
    location,
    image_url,
    duration,
    is_freetransport,
    price,
  } = req.body;

  const id = req.params.id;

  const query =
    "UPDATE destinations SET name = ?, description = ?, location = ?, image_url = ?, duration = ?, is_freetransport = ?, price = ? WHERE id = ?";
  const values = [
    name,
    description,
    location,
    image_url,
    duration,
    is_freetransport,
    price,
    id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Destination with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Update destination successfully",
    });
  });
};

export const deleteDestinationById = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM destinations WHERE id = ${id}`;

  db.query(query, (err, datas) => {
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
        message: `Destination with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Delete destination successfully",
    });
  });
};

export const createDestinationRating = (req, res) => {
  const { rating, review } = req.body;
  const user_id = req.user.id;
  const destination_id = req.params.id;
  const createdAt = new Date();
  const updatedAt = createdAt;

  const query =
    "INSERT INTO destination_rate (destination_id, user_id, rating, review, created_at, updated_at ) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [
    destination_id,
    user_id,
    rating,
    review,
    createdAt,
    updatedAt,
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

    res.status(201).json({
      status: 201,
      success: true,
      message: "Destination rating created successfully",
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
