const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const db = require('./database')

let app = express()

app.listen(3000, ()=>{
    console.log('Express server started at port: 3000')
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use(expressLayouts)
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(session({
    secret:"secret",
    cookie: {maxAge:6000},
    resave: true,
    saveUninitialized: true
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const inventoryController = require('./controllers/inventoryController')

app.use('/inventory', inventoryController)

app.get('/', (req, res)=>{
    res.render('index')
})