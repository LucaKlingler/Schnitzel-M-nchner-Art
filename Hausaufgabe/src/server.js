const axios = require('axios').default;
const express =  require('express');

const app = express();

let data = '';

axios({
  method: 'get',
  url: 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json',
  responseType: 'json'
})
.then(function (response) {
 data = response.data;
});
app.get('/user/:uid', (req, res) => {
  res.send('User ID  is set to ${req.params.uid}');
});

app.get('/mensa/:day',  (req, res) => {
  if (req.params.day === 'Di') {
    res.send(data);
  } else {
    res.status(404).send('404');
  }
});

//Server starten
app.listen(3000, () => {
  console.log('Example app listening on port  3000!');
});