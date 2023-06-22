const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
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

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN)
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })

        app.get('/users', async (req, res) => {
            const filter = {};
            const users = await usersCollection.find(filter).toArray();
            res.send(users)
        })



        app.get('/users/allbuyers', async (req, res) => {
            const userType = req.query.userType;
            const filter = { userType }
            const allbuyers = await usersCollection.find(filter).toArray();
            res.send(allbuyers);
        })

        app.get('/users/allsellers', async (req, res) => {
            const userType = req.query.userType;
            const filter = { userType }
            const allsellers = await usersCollection.find(filter).toArray();
            res.send(allsellers);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })
        app.put('/users/allsellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    VerificationStatus: 'verified'
                }
            };
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            console.log(result);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            console.log(result);
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