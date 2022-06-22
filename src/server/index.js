const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 6464;

app.use(cors())
app.use(express.static('public'))
let jsonParser = bodyParser.json()

app.get('/', (req, res) => {
    console.log(__dirname)
    res.send({msg: 'Server'});
});

app.post('/save', jsonParser, (req, res) => {
    let filename = req.body.date
    console.log(req.body)
    fs.writeFileSync(`./src/logs/${filename}_log.json`, JSON.stringify(req.body), err => {
        if (err) {
            console.log(err)
        }
    })
})

app.get('/load/:file', (req, res) => {
    console.log('Loading...')
    let filename = req.params.file
    if (fs.existsSync(`./src/logs/${filename}_log.json`)) {
        let raw = fs.readFileSync(`./src/logs/${filename}_log.json`)
        res.send(JSON.parse(raw));
    } else {
        res.status(401)
    }
});

app.get('*', (req, res) => {
    console.log('here')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    console.log(__dirname)
});