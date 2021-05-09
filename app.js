require("dotenv").config();

const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const {
  handleResourceNotFoundError,
  handleUnprocessableEntityError,
  handleServerError,
  handleUnauthorized,
  handleForbidden,
} = require("./controllers/error");
const UnprocessableEntityError = require("./errors/unprocessable-entity-error");

const PORT = 8080;

const app = express();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images");
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.jpeg`);
  },
});

function fileFilter(req, file, cb) {
  try {
    switch (file.mimetype) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
        cb(null, true);
        break;
      default:
        cb(null, false);
        break;
    }
  } catch (error) {
    cb(new UnprocessableEntityError("Could not process file."));
  }
}

app.use(express.json());
app.use(multer({ storage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(handleUnprocessableEntityError);
app.use(handleServerError);
app.use(handleResourceNotFoundError);
app.use(handleUnauthorized);
app.use(handleForbidden);

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
