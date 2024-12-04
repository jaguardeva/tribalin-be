import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accommodationRoute from "./routes/accommodationRoute.js";
import authRoute from "./routes/authRoute.js";
import destionationRoute from "./routes/destinationRoute.js";
import itinerariesRoute from "./routes/itinerariesRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", accommodationRoute);
app.use("/api/auth", authRoute);
app.use("/api", destionationRoute);
app.use("/api", itinerariesRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "OK",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
