const express = require('express')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000;

// mongoDB connection 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yp2u3.mongodb.net/faveTravelDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const database = client.db("faveTravelDB");
      const serviceCollection = database.collection("serviceCollection");
      const bookingCollection = database.collection("bookingCollection")
      // create a document to insert
      
    //   post method for add products 
      app.post('/services', async(req, res) => {
          const services = req.body;
          console.log('req data', services)
          const result = await serviceCollection.insertOne(services)
          res.json(result)
      })

      // get method for services 
      app.get('/services', async(req, res) => {
        const cursor = serviceCollection.find({})
        const result = await cursor.toArray();
        res.send(result)
      })

      app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.json(service);
      })

      // booking post data 
      app.post('/booking', async(req, res) => {
        const service = req.body;
        console.log(service)
        const result = await bookingCollection.insertOne(service)
        res.json(result)
      })

      //orders get data
      app.get('/booking', async(req, res) => {
        const cursor = bookingCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
      })

      // delete order 
      app.delete('/booking/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await bookingCollection.deleteOne(query);
        // console.log('deleted id', result)
        res.json(result);
      })


      // update api 
      app.put('/booking/:id', async(req, res)=>{
        const id = req.params.id;
        console.log(id)
        const status=req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              orderStatus: status.status
            }
        };
        const result = await bookingCollection.updateOne(filter, updateDoc, options);
        res.json(result);     

    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.use(cors());
app.use(express.json());







app.get('/', (req, res) => {
  res.send('Express Running!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})