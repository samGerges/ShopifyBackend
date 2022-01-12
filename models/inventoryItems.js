let mongoose = require("mongoose");

let itemsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    }
})

let Items = module.exports = mongoose.model('Items', itemsSchema)