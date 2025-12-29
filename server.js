const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection error:", err));

const port = process.env.PORT || 1000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
