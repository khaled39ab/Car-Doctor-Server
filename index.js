const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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


const verifyJWT = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
        return res.status(401).send({ message: 'unauthorized access' })
    };
    const token = authHeaders.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
};


const run = async () => {

    try {
        const servicesCollection = client.db("MotorService").collection("services");
        const productsCollection = client.db("MotorService").collection("products");
        const ordersCollection = client.db("MotorService").collection("order");


        app.post('/jwt', (req, res) => {
            const user = req.body;
            const carToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ carToken })
        });



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
        app.get('/orders', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const queryEmail = req.query.email;

            if (decodedEmail !== queryEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            };

            let query = {};

            //for query search
            if (queryEmail) {
                query = {
                    email: queryEmail
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


        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await ordersCollection.updateOne(query, updateDoc)
            res.send(result)
        });


        app.delete('/orders/:id', async (req, res) => {
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


run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send("Server is running")
});

app.listen(port, () => {
    console.log('Server running from', port);
});