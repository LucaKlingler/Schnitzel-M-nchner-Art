const axios = require('axios').default;
const express = require('express');
const cors = require('cors');

let app = express();
app.use(express.json());
app.use(cors());
let loadedData;

let data = '';
const uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';

async function getData() {
  await axios.get(uri)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => {
      data = undefined;
    });
}
getData();

app.get('/user/:uid', (req, res) => {
  res.send('User ID  is set to ${req.params.uid}');
});

app.get('/mensa/:day', (req, res) => {
  if (data !== undefined) {
    if (req.params.day === 'Di') {
      res.send(data);
    } else {
      res.status(404).send('missing data');
    }
  } else {
    res.status(404).send('Error: 404');
  }
});

app.post('/api/addData/', (req, res)  => {
  if (!JSON.stringify(data).includes(JSON.stringify(req.body))) {
    data.append(req.data);
    res.status(200).send();
  }
  else {
    res.status(403).send("Already loaded");
  }
});

app.get('/api/getData/', (req, res)  => {
  res.status(200).send(data);
});

//Server starten
app.listen(3000, () => {
  console.log('Example app listening on port  3000!');
});