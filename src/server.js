const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

app.use('/', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the Budget App Server');
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/budget', (req, res) => {
  fs.readFile('./budget.json', 'utf8', (err, data) => {
   
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});