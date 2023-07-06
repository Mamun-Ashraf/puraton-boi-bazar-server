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
        const myOrdersCollection = client.db('bookBazar').collection('myOrders');

        app.get('/categoryTitle', async (req, res) => {
            const query = {};
            const projection = { categoryName: 1 };
            const result = await categoryCollection.find().project(projection).toArray();
            res.send(result);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const category = await categoryCollection.findOne(query);
            res.send(category);
        })

        app.get('/categoryBook/:categoryname', async (req, res) => {
            const categoryName = req.params.categoryname;
            const filter = { categoryName: categoryName };
            const result = await categoryCollection.findOne(filter);
            res.send(result);
        })

        app.put('/category/:categoryname', async (req, res) => {
            const categoryName = req.params.categoryname;
            const category = req.body;
            const filter = { categoryName: categoryName };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    categoryBooks: category
                }
            }
            const result = await categoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
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

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const user = await usersCollection.findOne(filter);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users/allbuyers', async (req, res) => {
            const userType = req.query.userType;
            const filter = { userType }
            const allbuyers = await usersCollection.find(filter).toArray();
            res.send(allbuyers);
        })

        app.get('/users/allbuyers/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const user = await usersCollection.findOne(filter);
            res.send({ isBuyer: user?.userType === 'Buyer' })
        })

        app.get('/users/allsellers', async (req, res) => {
            const userType = req.query.userType;
            const filter = { userType }
            const allsellers = await usersCollection.find(filter).toArray();
            res.send(allsellers);
        })

        app.get('/users/allsellers/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const user = await usersCollection.findOne(filter);
            res.send({ isSeller: user?.userType === 'Seller' })
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

        app.get('/myProducts', async (req, res) => {
            const query = {};
            const ProductsData = await categoryCollection.find(query).toArray();
            res.send(ProductsData);

        })

        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const myOrders = await myOrdersCollection.find(query).toArray();
            res.send(myOrders);
        })

        app.post('/myOrders', async (req, res) => {
            const myOrders = req.body;
            const result = await myOrdersCollection.insertOne(myOrders);
            res.send(result);
        })

        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const myOrders = await myOrdersCollection.deleteOne(query);
            res.send(myOrders);
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