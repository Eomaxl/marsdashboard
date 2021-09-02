require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/nasaAPI', async (req, res) => {
    try {
        const roverName = req.get('roverName');
        console.log(`API called for : ${roverName}`);
        const image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=1&api_key=OOVCRMvhsQRxSt8q30iaswDKyQsVQgk6hcW4ad9w`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`))