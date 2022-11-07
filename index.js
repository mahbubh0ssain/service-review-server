const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
//middle wares
app.use(cors());
app.use(express.json());

//api's
app.get("/", (req, res) => {
  res.send("Mr. Plumber server side running successfully. ");
});

//mongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@plumberservices.r1r9xon.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// connect DB
const connectDb = async () => {
  try {
    await client.connect();
    console.log("DB connect successfully.");
  } catch (err) {
    console.error(err);
  }
};
connectDb();

app.listen(port, () => {
  console.log("Mr. Plumber server is running on port", port);
});
