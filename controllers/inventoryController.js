const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;
const path = require('path')

let Items = require('../models/inventoryItems.model')
let Transactions = require('../models/transactions.model')

router.use(require('connect-flash')());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

let getInventory = async () => {
    
    let result = await Items.find({}, (err, items)=>{
        if (err){
            console.log(err)
            return
        }
        else{
            return items
        }
            
    })

    return result

}

let getTransactions = async () => {
    
    let result = await Transactions.find({}, (err, items)=>{
        if (err){
            console.log(err)
            return
        }
        else{
            return items
        }
            
    })

    return result

}

let getItemByID = async (id) => {
    
    let result = await Items.findById(id, (err, item)=>{
        if (err){
            console.log(err)
            return
        }
        else{
            return item
        }
            
    })

    return result

}
let getItemByName = async (name) => {

    let query = {name: name}
    
    let result = await Items.findOne(query, (err, item)=>{
        if (err){
            console.log(err)
            return {}
        }
        else{
            return item
        }
            
    })

    return result

}

let createTransaction = (itemId, amountChange, type)=>{
    let transaction = {}

    transaction.itemId = itemId

    transaction.amount = amountChange

    transaction.type = type

    currentDate = new Date()
    transaction.date = currentDate.toString()

    return transaction
}

router.get('/', async (req, res)=>{

    let items = await getInventory()

    return es.render('inventory', {
        items:items
    })
})

router.post('/add', async (req, res)=>{

    let name = req.body.name
    let amount = req.body.amount

    if(name == '' || amount == ''){
        req.flash("danger", "Missing form data")
        return res.redirect('/inventory')
    }

    let formItem = {}

    formItem.name = name
    formItem.amount = Number(amount)

    let currentItem = await getItemByName(formItem.name)

    if (currentItem != null){

        formItem.amount += currentItem.amount

        let transaction = createTransaction(currentItem._id, formItem.amount, "Increase")

        let query = {_id: currentItem._id}

        Items.findOneAndUpdate(query, formItem, (err)=>{
            if(err) console.log(err)
            else {
    
                let trans = new Transactions(transaction)
    
                trans.save((err)=>{
                    if(err) console.log(err)
    
                    else {
                        req.flash("success", "Item found and increased inventory")
                        return res.redirect('/inventory')
                    }
                })
            }
            
        })

    }else{

        let newItem = new Items(formItem)

        newItem.save((err)=>{
            if(err) console.log(err)

            req.flash("success", "Item added to inventory")
            return res.redirect('/inventory')
        })
    
    }
    
})

router.post('/sales', async (req, res)=>{

    let name = req.body.name
    let amount = req.body.amount

    if(name == '' || amount== ''){
        req.flash("danger", "Missing form data")
        return res.redirect('/inventory')
    }

    let formItem = {}

    formItem.name = name
    formItem.amount = Number(amount)

    let currentItem = await getItemByName(formItem.name)

    if (currentItem){


        let transaction = createTransaction(currentItem._id, formItem.amount, "Decrease")

        formItem.amount = currentItem.amount - formItem.amount

        let query = {_id: currentItem._id}

        Items.findOneAndUpdate(query, formItem, (err)=>{
            if(err) console.log(err)
            else {
    
                let trans = new Transactions(transaction)
    
                trans.save((err)=>{
                    if(err) console.log(err)
    
                    else {
                        req.flash("success", "Sale recorded!")
                        return res.redirect('/inventory')
                    }
                })
            }
            
        })

    }else{
        req.flash('danger', "Item not found")
        return res.redirect('/inventory')
    }
    
})


router.get('/edit?:id', async (req, res)=>{
    
    let item = await getItemByID(req.query.id)

    res.render('editItem', {
        item: item
    })
})

router.post('/edit?:id', async (req, res)=>{

    let query = {_id: req.query.id}

    let currentItem = await getItemByID(req.query.id)

    let name = req.body.name
    let amount = req.body.amount

    if(name == '' || amount== ''){
        req.flash("danger", "Missing form data")
        return res.redirect('inventory')
    }

    let formItem = {}

    formItem.name = name
    formItem.amount = Number(amount)

    let amountDiff = formItem.amount - currentItem.amount

    type = ""

    if (amountDiff >= 0) {
        type = "Increase"
    }else {
        type = "Decrease"
    }


    let transaction = createTransaction(req.query.id, Math.abs(amountDiff), type)

    Items.findOneAndUpdate(query, formItem, (err)=>{
        if(err) console.log(err)
        else {

            let trans = new Transactions(transaction)

            trans.save((err)=>{
                if(err) console.log(err)

                else {
                    req.flash("success", "Item updated!")
                    return res.redirect('/inventory')
                }
            })
        }
        
    })

})

router.get('/edit/delete?:id', (req, res)=>{

    let query = {_id: req.query.id}

    Items.findOneAndDelete(query, (err)=>{
        if(err) console.log(err)
        else {
            req.flash("success", "Item successfuly deleted!")
            return res.redirect('/inventory')
        }
    })

})

router.get('/export/inventory', async (req, res) =>{
    let items = await getInventory()

    const fields = ['id', 'name', 'amount'];

    let csv
    try {
      csv = json2csv(items, { fields });
      const dateTime = moment().format('YYYYMMDDhhmmss');
      return res.attachment("csv-" + dateTime + ".csv").send(csv)

    } catch (err) {
      return res.status(500).json({ err });
    }

})
router.get('/export/history', async (req, res) =>{
    let items = await getTransactions()

    const fields = ["id", "itemId", "amount", "type", "date"];

    let csv
    try {
      csv = json2csv(items, { fields });
      const dateTime = moment().format('YYYYMMDDhhmmss');
      return res.attachment("csv-" + dateTime + ".csv").send(csv)

    } catch (err) {
      return res.status(500).json({ err });
    }

})

module.exports = router