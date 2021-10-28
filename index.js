const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.14uaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Car-service").collection("service");

    //   get
    app.get("/service", async (req, res) => {
      const cursor = database.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // find single user
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await database.findOne(query);
      res.json(service);
    });
    //   post
    app.post("/service", async (req, res) => {
      const serviceBody = req.body;
      const result = await database.insertOne(serviceBody);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from genius car server");
});
app.get("/hello", (req, res) => {
  res.send("hello from heroku car server");
});
app.listen(port, () => {
  console.log("listening from port", port);
});
