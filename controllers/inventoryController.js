const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

let Items = require('../models/inventoryItems.model')
let Transactions = require('../models/transactions.model')

let getItems = async () => {
    
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

    let items = await getItems()

    res.render('inventory', {
        items:items
    })
})

router.post('/add', async (req, res)=>{

    let formItem = {}

    formItem.name = req.body.name
    formItem.amount = Number(req.body.amount)

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
                        res.redirect('/inventory')
                    }
                })
            }
            
        })

    }else{

        let newItem = new Items(formItem)

        newItem.save((err)=>{
            console.log(err)
            res.redirect('/inventory')
        })
    
    }
    
})

router.post('/sales', async (req, res)=>{

    let formItem = {}

    formItem.name = req.body.name
    formItem.amount = Number(req.body.amount)

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
                        res.redirect('/inventory')
                    }
                })
            }
            
        })

    }
    
})


router.get('/edit?:id', async (req, res)=>{
    
    let item = await getItemByID(req.query.id)

    res.render('editItem', {
        item: item
    })
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

    let newItem = {}

    newItem.name = req.body.name
    newItem.amount = Number(req.body.amount)

    let amountDiff = newItem.amount - currentItem.amount

    type = ""

    if (amountDiff >= 0) {
        type = "Increase"
    }else {
        type = "Decrease"
    }


    let transaction = createTransaction(req.query.id, Math.abs(amountDiff), type)

    Items.findOneAndUpdate(query, newItem, (err)=>{
        if(err) console.log(err)
        else {

            let trans = new Transactions(transaction)

            trans.save((err)=>{
                if(err) console.log(err)

                else {
                    res.redirect('/inventory')
                }
            })
        }
        
    })

})

router.get('/edit/delete?:id', (req, res)=>{

    let query = {_id: req.query.id}

    Items.findOneAndDelete(query, (err)=>{
        if(err) console.log(err)
        else 
            res.redirect('/inventory')
    })

})

module.exports = router