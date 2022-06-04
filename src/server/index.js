const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 6464;

app.use(cors())
let jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  console.log(__dirname)
  res.send({ msg: 'Express + TypeScript Server' });
});

app.post('/save', jsonParser, (req, res) => {
  fs.writeFile('../logs/test.json', JSON.stringify(req.body), err => {
    if (err) {
      console.log(err)
    }
  })
  fs.readFile('../logs/test.json', (err, data) => {
    if (err) throw err;
    console.log(data);
  })
  console.log(req.body)
})

app.get('*', (req, res) => {
  console.log('here')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});