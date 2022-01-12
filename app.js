require('./database')

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

let app = express()

app.listen(3000, ()=>{
    console.log('Express server started at port: 3000')
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.set('views', './views')
app.set('view engine', 'ejs')

const inventoryController = require('./controllers/inventoryController')

app.use('/inventory', inventoryController)

app.get('/', (req, res)=>{
    res.render('index')
})