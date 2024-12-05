import db from "../../config/database.js";

export const getItineraries = (req, res) => {
  const query = "SELECT * FROM itineraries";

  db.query(query, (err, result) => {
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
      message: "OK",
      data: result,
    });
  });
};

export const getItinerariesByUserId = (req, res) => {
  const user_id = req.user.id;
  const query = `SELECT * FROM itineraries WHERE user_id = ${user_id}`;

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
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "OK",
      data: result,
    });
  });
};

export const getItinerariesByIdAndUserId = (req, res) => {
  const id = req.params.id;
  const user_id = req.user.id;
  const query = `SELECT * FROM itineraries WHERE user_id = ${user_id} AND id = ${id}`;

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
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "OK",
      data: result,
    });
  });
};

export const createItinerary = (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  const user_id = req.user.id;
  const createdAt = new Date();
  const updatedAt = createdAt;

  const query =
    "INSERT INTO itineraries (user_id, title, description, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    title,
    description,
    start_date,
    end_date,
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
      message: "Itinerary created successfully",
      data: {
        id: datas.insertId,
        title,
        description,
        start_date,
        end_date,
        created_at: createdAt,
        updated_at: updatedAt,
      },
    });
  });
};
