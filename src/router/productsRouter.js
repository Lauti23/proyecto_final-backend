const express = require('express')
const productsRouter = express.Router()
const ProductsManager = require('../controllers/productsManager')
const productManager = new ProductsManager

isAdmin = true

productsRouter.get('/', async (req, res) => {
    productManager.getAll()
        .then(result => res.send(result))
        .catch(err => res.status(404).send({error: 0, message: err.message}))
})

productsRouter.get('/:id', async (req, res) => {
    if (isNaN(req.params.id)) return res.status(400).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    let item = await productManager.getById(parseInt(req.params.id))
    item.status === "error" ? res.status(400).send(item) : res.send(item)
})

productsRouter.post('/', async (req, res) => {
    if (!isAdmin) return res.status(401).send({error: -1, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no autorizado`})
    if (!req.body.name || !req.body.description || !req.body.code || !req.body.url || !req.body.price || !req.body.stock) 
    return res.status(400).send({ error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada` });
    productManager.create(req.body)
        .then(result => res.send(result))
        .catch(err => res.send({error:0, message: err.message}).status(400))
})

productsRouter.put('/:id', (req, res) => {
    if (!isAdmin) return res.status(400).send({error: -1, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no autorizado `})
    if (isNaN(req.params.id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    if (!req.body.name || !req.body.description || !req.body.code || !req.body.url || !req.body.price || !req.body.stock) 
    return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    productManager.update(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(err => res.send({error: 0, message: err.message}))
})

productsRouter.delete('/:id', (req, res) => {
    if (!isAdmin) return res.send({error: -1, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no autorizado `})
    if (isNaN(req.params.id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    productManager.delete(req.params.id)
        .then(result => res.send(result))
        .catch(err => res.send({error: 0, message: err.message}))
})

module.exports = productsRouter