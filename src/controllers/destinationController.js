import db from "../../config/database.js";

export const getDestinations = (req, res) => {
  const query = `
    SELECT 
      destinations.*, 
      AVG(destination_rate.rating) AS avg_rating,
      COUNT(destination_rate.id) AS total_rating
    FROM 
      destinations 
    LEFT JOIN 
      destination_rate 
    ON 
      destinations.id = destination_rate.destination_id
    GROUP BY 
      destinations.id
  `;

  db.query(query, (err, datas) => {
    if (err) {
      console.error("Database query error:", err.message);
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
        message: "No destinations found.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Destinations retrieved successfully.",
      data: datas,
    });
  });
};

export const getDestinationById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT destinations.*, AVG(destination_rate.rating) AS avg_rating, COUNT(destination_rate.id) AS total_rating
FROM destinations
LEFT JOIN destination_rate ON destinations.id = destination_rate.destination_id
WHERE destinations.id = ${id}
GROUP BY destinations.id`;

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
  const createdAt = new Date();
  const updatedAt = createdAt;

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

export const getDestiantionRating = (req, res) => {
  const destination_id = req.params.id;

  const query = `SELECT destination_rate.id, destination_rate.rating, destination_rate.review, destination_rate.created_at, destination_rate.updated_at, users.name as author FROM destination_rate INNER JOIN users ON destination_rate.user_id = users.id WHERE destination_id = ${destination_id}`;

  db.query(query, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }

    if (datas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Destination rating not found!",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Get destination rating successfully!",
      data: datas,
    });
  });
};

export const getDestinationRatingById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT destination_rate.*, users.name as author FROM destination_rate INNER JOIN users ON destination_rate.user_id = users.id WHERE destination_rate.id = ${id}`;

  db.query(query, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }

    if (datas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Destination rating not found!",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Get destination rating successfully!",
      data: datas,
    });
  });
};

export const deleteDestinationRatingById = async (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM destination_rate WHERE id = ${id}`;

  db.query(query, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }

    if (datas.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Destination rating not found!",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Delete destination rating successfully!",
    });
  });
};
