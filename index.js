const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.laf8zrf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('bookBazar').collection('books');
        const usersCollection = client.db('bookBazar').collection('users');

        app.get('/category', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find().toArray();
            res.send(categories);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const category = await categoryCollection.findOne(query);
            res.send(category);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello from puraton boi bazar');
});

app.listen(port, () => {
    console.log(`puraton boi bazar is running on ${port}`);
})


// git remote add origin https://github.com/Mamun-Ashraf/puraton-boi-bazar-server.git
// git push -u origin main