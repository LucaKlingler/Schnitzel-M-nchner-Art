// Imports
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
    let daydata = data.filter(essen => essen.day == req.params.day);
    if(daydata.length === 0) {
      res.status(404).send('Error 404');
    } else {
      res.send(daydata);
    }
  } else {
    res.status(404).send('Error: 404');
  }
});

app.post('/mensa/insert'), (req, res) => {
  //Rausfinden ob Mahlzeit für gegebene Kategorie und Tag schon gibt
  let findResult = data.find(essen => (essen.category === req.body.category && essen.day == req.body.day))

  if(findResult == undefined) {
    data.push(req.body);
    res.status(200).send(OK)
  } else {
    res.status(418).send('im a teapot');
  }
}

app.get('/api/getData/', (req, res)  => {
  res.status(200).send(data);
});

//Server starten
app.listen(3000, () => {
  console.log('Example app listening on port  3000!');
});

