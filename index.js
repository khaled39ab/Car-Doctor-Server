const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });


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