require('./database')

const express = require('express')

let app = express()

app.listen(3000, ()=>{
    console.log('Express server started at port: 3000')
})

app.get('/', (req, res)=>{
    res.send("Hello World")
})