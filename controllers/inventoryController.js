const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

let Items = require('../models/inventoryItems')

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

router.get('/', async (req, res)=>{

    let items = await getItems()

    console.log(items)

    res.render('inventory', {
        items:items
    })
})

router.post('/add', (req, res)=>{
    console.log(req.body)

    let item = {}

    item.name = req.body.name
    item.amount = Number(req.body.amount)

    let newItem = new Items(item)

    newItem.save((err)=>{
        console.log(err)
        res.redirect('/inventory')
    })

    
})

router.get('/edit?:id', async (req, res)=>{
    
    let item = await getItemByID(req.query.id)

    res.render('editItem', {
        item: item
    })
})

router.post('/edit?:id', (req, res)=>{

    let query = {_id: req.query.id}

    let item = {}

    item.name = req.body.name
    item.amount = Number(req.body.amount)

    Items.findOneAndUpdate(query, item, (err)=>{
        if(err) console.log(err)
        else 
            res.redirect('/inventory')
    })

})

router.get('/edit/delete?:id', async (req, res)=>{

    let query = {_id: req.query.id}

    await Items.findOneAndDelete(query, (err)=>{
        if(err) console.log(err)
        else 
            res.redirect('/inventory')
    })

})

module.exports = router