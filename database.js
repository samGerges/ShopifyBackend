const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ShopifyDB', {useNewUrlParser: true}, 
    (err)=>{
        if(!err) console.log("MongoDB Connection Successful.")
        else console.log("MongoDB Connection Failed. Error: " + err)
    })

    