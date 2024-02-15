require('dotenv').config()

const express = require('express')
var cors = require("cors")
const app = express()
// const router = require('./routers/router')
const router = require('../server/routers/router');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(router)

app.get('/', (req, res) => {
    console.log('masuk')
})
 

module.exports = app
