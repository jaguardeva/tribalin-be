import db from "../../config/database.js";


export const searchDestinationByName = (req, res) => {
  const { name } = req.query;

  // Validasi input query
  if (!name) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Bad Request: Missing 'name' query parameter",
    });
  }

  const query = "SELECT * FROM destinations WHERE name LIKE ?";
  const values = [`%${name}%`]; // Menggunakan wildcard untuk pencarian LIKE

  db.query(query, values, (err, results) => {
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
        message: `No destinations found with name containing '${name}'`,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Destinations retrieved successfully",
      data: results,
    });
  });
};

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

  // Gunakan nilai saat ini untuk created_at dan updated_at
  const createdAt = new Date();
  const updatedAt = createdAt;

  // Pastikan jumlah placeholder (?) sesuai dengan jumlah kolom
  const query =
    "INSERT INTO destinations (name, description, location, image_url, duration, is_freetransport, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    name,
    description,
    location,
    image_url,
    duration,
    is_freetransport,
    price,
    createdAt, // Tambahkan created_at
    updatedAt, // Tambahkan updated_at
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
    });
  });
};

export const editDestinationById = (req, res) => {
  const id = req.params.id;

  // Buat array untuk menyimpan query dinamis dan nilai
  const updates = [];
  const values = [];

  // Cek field yang dikirim dalam req.body dan tambahkan ke query
  if (req.body.name) {
    updates.push("name = ?");
    values.push(req.body.name);
  }
  if (req.body.description) {
    updates.push("description = ?");
    values.push(req.body.description);
  }
  if (req.body.location) {
    updates.push("location = ?");
    values.push(req.body.location);
  }
  if (req.body.image_url) {
    updates.push("image_url = ?");
    values.push(req.body.image_url);
  }
  if (req.body.duration) {
    updates.push("duration = ?");
    values.push(req.body.duration);
  }
  if (req.body.is_freetransport !== undefined) {
    updates.push("is_freetransport = ?");
    values.push(req.body.is_freetransport);
  }
  if (req.body.price) {
    updates.push("price = ?");
    values.push(req.body.price);
  }

  // Tambahkan ID ke array nilai
  values.push(id);

  // Jika tidak ada field yang di-update
  if (updates.length === 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Bad Request: No fields to update",
    });
  }

  // Buat query dinamis
  const query = `UPDATE destinations SET ${updates.join(", ")} WHERE id = ?`;

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


//RATING
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


export const getDestinationRating = (req, res) => {
  const destination_id = req.params.id;

  const query = `
    SELECT 
      destination_rate.id, 
      destination_rate.rating, 
      destination_rate.review, 
      destination_rate.created_at, 
      destination_rate.updated_at, 
      users.name AS author 
    FROM destination_rate 
    INNER JOIN users 
      ON destination_rate.user_id = users.id 
    WHERE destination_rate.destination_id = ?
  `;

  db.query(query, [destination_id], (err, datas) => {
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
