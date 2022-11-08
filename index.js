const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

const plumberServices = client.db("mrPlumber").collection("plumberServices");

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

// all data
app.get("/all-service", async (req, res) => {
  try {
    const services = await plumberServices.find({}).toArray();
    count = await plumberServices.countDocuments();
    res.send({
      success: true,
      count: count,
      data: services,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

//limit data
app.get("/service", async (req, res) => {
  try {
    const services = await plumberServices.find({}).limit(3).toArray();
    res.send({
      success: true,
      data: services,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

//get data by id
app.get("/all-service/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await plumberServices.findOne({ _id: ObjectId(id) });
    res.send({
      success: true,
      data: service,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

app.post("/add-service", async (req, res) => {
  try {
    const addedService = await plumberServices.insertOne(req.body);
    console.log(addedService);
    res.send(addedService);
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log("Mr. Plumber server is running on port", port);
});
