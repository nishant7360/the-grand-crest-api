const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const db_url = process.env.DB_URI.replace(
  "<db_password>",
  process.env.DB_PASSWORD,
);

mongoose
  .connect(db_url, {})
  .then(() => {
    console.log("Database connected successfully...");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(8000, () => {
  console.log("Server listning on PORT 8000");
});
