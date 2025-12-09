var express = require('express');
var bodyParser = require('body-parser');
var { MongoClient } = require('mongodb');

var app = express();
app.use(bodyParser.json());
var client = new MongoClient('mongodb://127.0.0.1:27017/');

var db;
var usersCollection;
var productsCollection;

async function connectDB() {
    await client.connect();
    db = client.db('adminPanel');
    usersCollection = db.collection('users');
    productsCollection = db.collection('products');
    console.log("Connected to MongoDB");
}

connectDB();

app.post('/api/addUser', async (req, res) => {
    var username = req.body.username;
    if (!username) return res.status(400).send("No username given");

    await usersCollection.insertOne({ username: username });
    res.send({ message: "User added", username: username });
});

app.delete('/api/removeUser', async (req, res) => {
    var username = req.body.username;
    if (!username) return res.status(400).send("No username given");

    var result = await usersCollection.deleteOne({ username: username });

    if (result.deletedCount === 0) {
        res.send({ message: "User not found" });
    } else {
        res.send({ message: "User removed", username: username });
    }
});

app.put('/api/changeProduct', async (req, res) => {
    var productId = req.body.productId;
    var newName = req.body.newName;

    if (!productId || !newName) {
        return res.status(400).send("Missing productId or newName");
    }

    var result = await productsCollection.updateOne(
        { _id: productId },
        { $set: { name: newName } }
    );

    if (result.matchedCount === 0) {
        res.send({ message: "Product not found" });
    } else {
        res.send({ message: "Product updated", id: productId, newName: newName });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});