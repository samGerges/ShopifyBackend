let mongoose = require("mongoose");

let transactionSchema = new mongoose.Schema({
    itemId: {
        type: String,
		required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
		required: true
    },
    date: {
        type: String,
		required: true
    }
})

let Transaction = module.exports = mongoose.model('Transaction', transactionSchema)