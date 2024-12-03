import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accommodationRoute from "./routes/accommodationRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", accommodationRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "OK",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
