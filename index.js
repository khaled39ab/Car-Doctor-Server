const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;
const app = express();



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MOTOR_USER}:${process.env.MOTOR_PASSWORD}@cluster0.mxmpcyg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send("Server is running")
});

app.listen(port, () =>{
    console.log('Server running from', port);
})