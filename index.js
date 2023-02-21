const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express();

//----  Middleware ---------
app.use(cors());
app.use(express.json());


//++++++++++   mongodb connection  ++++++++++++++++++
const uri = `mongodb+srv://${process.env.MOTOR_USER}:${process.env.MOTOR_PASSWORD}@cluster0.mxmpcyg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {

    try {
        const servicesCollection = client.db("MotorService").collection("services");
        const productsCollection = client.db("MotorService").collection("products");
        const ordersCollection = client.db("MotorService").collection("order");

        /* 
        ================================================================================
        ++++++++++++++++++++++++++++++   Services Section  +++++++++++++++++++++++++++++
        ================================================================================
        */
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const cursor = await servicesCollection.findOne(query);
            res.send(cursor)
        });


        /* 
        ================================================================================
        ++++++++++++++++++++++++++++++    Orders Section   +++++++++++++++++++++++++++++
        ================================================================================
        */
        app.get('/orders', async (req, res) => {
            let query = {};

            //for query search
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            };

            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });


        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result);
        });


        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        });


        /* 
        ================================================================================
        ++++++++++++++++++++++++++++++   Products Section  +++++++++++++++++++++++++++++
        ================================================================================
        */
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

    }
    finally {
        // await client.close();
    }
}


run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send("Server is running")
});

app.listen(port, () => {
    console.log('Server running from', port);
});