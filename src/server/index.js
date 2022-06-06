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
    let filename = req.body.date
    console.log(req.body)
    fs.writeFileSync(`../logs/${filename}.json`, JSON.stringify(req.body), err => {
        if (err) {
            console.log(err)
        }
    })
})

app.get('/load/:file', (req, res) => {
    console.log('Loading...')
    let filename = req.params.file
    let raw = fs.readFileSync(`../logs/${filename}.json`)
    res.send(JSON.parse(raw));
});

app.get('*', (req, res) => {
    console.log('here')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});