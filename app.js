const express = require("express");

const feedRoutes = require("./routes/feed");

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/feed", feedRoutes);

app.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
