require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");
const { handleUnprocessableEntityError, handleServerError } = require("./controllers/error");

const PORT = 8080;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use(handleUnprocessableEntityError);
app.use(handleServerError);

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));
