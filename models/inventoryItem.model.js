let mongoose = require("mongoose");

let itemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    }
})

let Item = module.exports = mongoose.model('Item', itemSchema)