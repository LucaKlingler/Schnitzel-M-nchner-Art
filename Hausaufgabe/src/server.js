// Imports
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb').MongoClient;


let app = express();
app.use(express.json());
app.use(cors());

const uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';

async function initMongo() {
  const client = await mongo.connect("mongodb://localhost:27017/mensa")
    .catch(err => { console.log(err); });
const db = await client.db();
return db;
};
async function addToDatabase(data) {
  const db = await initMongo ();
  const insertresult = await db.collection('essen').insertOne(data, (error) => {
    if (error) throw error;
    console.log('Mahlzeit hinzugefügt');
  });
  return insertresult;
}

async function getFromDatabase(keyword) {
  const db = await initMongo();
  const getResult = await db.collection('essen').find(keyword).toArray();
  return getResult;
}

async function getData() {
  await axios.get(uri)
    .then((response) => {
      response.data.forEach(essen => {
        addToDatabase(essen);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
//getData();

app.get('/user/:uid', (req, res) => {
  res.send('User ID  is set to ${req.params.uid}');
});

app.get('/mensa/:day', async (req, res) => {
  const searchResults = await getFromDatabase({ day: req.params.day });
  if (searchResults.length > 0) {
    res.send(searchResults);
  } else {
    res.status(404).send('Error: 404');
  }
});

app.post('/mensa/:day', async (req, res) => {
  // TODO: Database search by keywords / identifiying key instead
  // of comparing the complete object (independence)
  if (typeof req.body === 'object' && !Array.isArray(req.body)) {
    const searchResults = await getFromDatabase(req.body);
    if (searchResults.length === 0) {
      await addToDatabase(req.body);
      res.status(200).send('Nice');
    } else {
      res.status(409).send('Warnung: Mahlzeit NICHT hinzugefügt');
    }
  } else {
    res.status(409).send('Conflict: Illegal format (only json object allowed)');
  }
});

app.get('/api/getData/', (req, res)  => {
  res.status(501).send();
});

//Server starten
app.listen(3000, () => {
  console.log('Example app listening on port  3000!');
});

