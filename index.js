const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require("express/lib/response");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://admin:amiadmin@cluster0.uv0dp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    console.log("connected with mongodb");
    const database = client.db("rusty-road-rides").collection("services");
    const expertDb = client.db("rusty-road-rides").collection("experts");
    const query = {};
    const result = await database.find(query).toArray();
    const expertResult = await expertDb.find(query).toArray();

    // auth
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(
        user,
        "34r39fdhgerot439uxcihr3ei5y340rthdcothwer5u403",
        {
          expiresIn: "2d",
        }
      );
      const token = { accessToken };
      res.send(token);
    });
    app.get("/exparts", async (req, res) => {
      res.send(expertResult);
    });
    app.get("/expart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await expertDb.findOne(query);
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      res.send(result);
    });
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await database.findOne(query);

      res.send(result);
    });

    app.post("/services/add", async (req, res) => {
      const item = req.body;
      const result = await database.insertOne(item);
      res.send(result);
    });
    //for orders
    const orderCollection = client.db("rusty-road-rides").collection("orders");
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      // console.log(result);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email };
      const result = await orderCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });
  } finally {
    // close the connection
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log("started");
});
