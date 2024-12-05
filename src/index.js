import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accommodationRoute from "./routes/accommodationRoute.js";
import authRoute from "./routes/authRoute.js";
import destionationRoute from "./routes/destinationRoute.js";
import transportationRoute from "./routes/transportationRoute.js";
import itinerariesRoute from "./routes/itinerariesRoute.js";
import transactionAccomodation from "./routes/transactionAccomodationRoute.js";
import transactionDestination from "./routes/transactionDestinationRoute.js";
import transactionTransportation from "./routes/transactionTransportationRoute.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", accommodationRoute);
app.use("/auth", authRoute);
app.use("/", destionationRoute);
app.use("/", itinerariesRoute);
app.use("/", transactionAccomodation);
app.use("/", transactionDestination);
app.use("/", transactionTransportation);
app.use("/", transportationRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "OK",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
