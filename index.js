const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
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

//post services
app.post("/add-service", async (req, res) => {
  try {
    const addedService = await plumberServices.insertOne(req.body);
    if (addedService.acknowledged) {
      res.send({
        success: true,
        data: addedService,
      });
    } else {
      res.send({
        success: false,
        message: "cant add new service",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      error: err.message,
    });
  }
});

const plumberReviews = client.db("mrPlumber").collection("Reviews");

//post reviews
app.post("/reviews", async (req, res) => {
  try {
    const reviews = await plumberReviews.insertOne(req.body);
    if (reviews.acknowledged) {
      res.send({
        success: true,
        data: reviews,
      });
    } else {
      res.send({
        success: false,
        message: "Cant't add review",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      success: true,
      error: err.message,
    });
  }
});

//get reviews by serviceId

app.get("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await plumberReviews
      .find({ serviceId: id })
      .sort({ _id: -1 })
      .toArray();
    if (result) {
      res.send({
        success: true,
        data: result,
      });
    } else {
      res.send({
        success: false,
        message: "Reviews not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      error: err.message,
    });
  }
});

//verify JWT
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access." });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Access forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

//get review by user email

app.get("/my-reviews", verifyJWT, async (req, res) => {
  try {
    const decoded = req.decoded;
    let query = {};
    if (decoded.email !== req.query.email) {
      return res.status(403).send({ message: "Access forbidden" });
    }
    if (req.query?.email) {
      query = { userEmail: req.query?.email };
    }
    const result = await plumberReviews.find(query).sort({ _id: -1 }).toArray();
    if (result) {
      res.send({
        success: true,
        data: result,
      });
    } else {
      res.send({
        success: false,
        message: "Reviews not found",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

//delete review
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await plumberReviews.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount) {
      res.send({
        success: true,
        data: result,
      });
    } else {
      res.send({
        success: false,
        message: "Can not delete this review",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

// update review
app.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isExist = await plumberReviews.findOne({ _id: ObjectId(id) });
    if (isExist) {
      const result = await plumberReviews.updateOne(
        { _id: ObjectId(id) },
        { $set: req.body }
      );
      if (result.modifiedCount) {
        res.send({
          success: true,
          data: result,
        });
      } else {
        req.send({
          success: false,
          message: "Can nor update review",
        });
      }
    }
  } catch (err) {
    req.send({
      success: false,
      error: err.message,
    });
  }
});

//JWT token

app.post("/jwt", async (req, res) => {
  try {
    const email = req.body;
    const token = jwt.sign(email, process.env.ACCESS_TOKEN);
    res.send({
      success: true,
      data: token,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log("Mr. Plumber server is running on port", port);
});
