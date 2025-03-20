const express = require('express')
const connectDB = require("./config/db");
const cors = require("cors");
const auth = require("./routes/auth");

const app = express()
const PORT = 8000

app.use(express.json());
app.use(cors());

app.use("/healthify/auth", auth);
app.use("/uploads", express.static("uploads")); // Serve uploaded images

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();
app.listen(PORT, () => {
  console.log(`Example app listening on PORT : ${PORT}`)
})