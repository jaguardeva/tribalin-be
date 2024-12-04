import db from "../../config/database.js";

export const getItineraries = (req, res) => {
    const query = "SELECT * FROM itineraries"; // Deklarasi dengan const
  
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
  