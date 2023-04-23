const { db } = require("../db")
const { getBaseUrl } = require("./helpers")
const Item = db.items

exports.getAll = async (req,res)=>{
    const items = await Item.findAll({attributes:["id", "name"]})
    res.send(JSON.stringify(items))
}
exports.createNew = async (req,res)=>{ 
    let item
    try {
        item = await Item.create(req.body,
            {
                logging: console.log,
                fields: ["name","description","category","posted"]
            })
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            res.status(400).send({"error":error.errors.map((item)=> item.message)})  
        } else {
            console.log("ItemsCreate:",error)
            res.status(500).send({"error":"Something went wrong on our side. Sorry :("})
        }
        return
    }
    res.status(201)
        .location(`${getBaseUrl(req)}/items/${item.id}`)
        .json(item)
}
exports.getById = async (req,res)=>{
    const item = await Item.findByPk(req.params.id, {logging: console.log})
    if (item === null){
        res.status(404).send({"error":"Item not found"})
    } else {
        res.send(item)
    }
}
exports.updateById = async (req,res)=>{    
    let item = await Item.findByPk(req.params.id, {logging: console.log})
    if (item === null){
        res.status(404).send({"error":"Item not found"})
        return
    } 
    try {
        item = await item.update(req.body, {logging: console.log})
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            res.status(400).send({"error":error.errors.map((item)=> item.message)})  
        } else {
            console.log("ItemsUpdate:",error)
            res.status(500).send({"error":"Something went wrong on our side. Sorry :("})
        }
        return
    }
    res.status(200)
        .location(`${getBaseUrl(req)}/items/${item.id}`)
        .json(item)
}
exports.deleteById = async (req,res)=>{    
    const item = await Item.findByPk(req.params.id, {logging: console.log})
    if (item === null){
        res.status(404).send({"error":"Item not found"})
        return
    }
    try {
        const deleted = await item.destroy()
    } catch (error) {
        console.log("ItemsDelete:",error)
        res.status(500).send({"error":"Something went wrong on our side. Sorry :("})
        return        
    }
    res.status(204).send()
}