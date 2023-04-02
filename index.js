const express = require('express');
const app = express();
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(express.json());

const items = [
    {id:1, name: "Witcher 3", price: 29.99},
    {id:2, name: "Cyberpunk 2077", price: 59.99},
    {id:3, name: "Minecraft", price: 26.99},
    {id:4, name: "Counter-Strike: Global Offensive", price: 0.00},
    {id:5, name: "Roblox", price: 0.00},
    {id:6, name: "Grand Theft Auto V", price: 29.99},
    {id:7, name: "Valorant", price: 0.00},
    {id:8, name: "Forza Horizon 5", price: 59.99},
    {id:9, name: "League of Legends", price: 0.00}
]

app.get('/items', (req, res) => {

    if (typeof items[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Item not found"})
    }

    res.send(items)
})

app.get('/items/:id', (req, res) => {
    res.send(items[req.params.id -1])
})

app.post('/items/:id', (req, res) => {
    if (!req.body.name || !req.body.price){
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let item = {
        id: items.length +1,
        price: req.body.price,
        name: req.body.name
    }

    items.push(item)
    
    res.status(201)
        .location(`${getBaseUrl(req)}/items/${items.lenght}`)
        .send(item)
})

app.delete('/items/:id', (req, res) =>{
    if (typeof items[req.params.id -1]=== 'undefined'){
        return res.status(404).send({error:"Item not found"})
    }

    items.splice(req.params.id -1, 1)

    res.status(204).send({error: "No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}
