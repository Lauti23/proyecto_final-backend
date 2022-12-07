const express = require('express')
const cartRouter = express.Router()
const CartManager = require('../controllers/cartManager')
const cartManager = new CartManager('src/data/carts.json')
const ProductManager = require('../controllers/productsManager')
const productManager = new ProductManager('src/data/products.json')

isAdmin = true

cartRouter.post('/', async (req, res) => {
    cartManager.createCart(req.body)
    .then(result => res.send(result))
    .catch(err => res.send.status(400)({error: 0, message: err.message}))
})

cartRouter.delete('/:id', async (req, res) => {
    if (isNaN(req.params.id && isNaN(req.params.id_prod))) return res.status(400).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    let item = await cartManager.delete(parseInt(req.params.id))
    item.status === 'error' ? res.status(400).send(item) : res.send (item);
})

cartRouter.get('/:id/products', async (req, res) => {
    if (isNaN(req.params.id && isNaN(req.params.id_prod))) return res.status(400).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    let item = await cartManager.getById(parseInt(req.params.id))
    item.status === "error" ? res.status(400).send(item) : res.send(item)
})

cartRouter.post('/:id/products/:id_prod', async (req, res) => {
    let cart = await cartManager.getCartProducts(parseInt(req.params.id));
    if (cart.status === "error") {
    return res.status(400).send(cart);}
    let product = await productManager.getById(parseInt(req.params.id_prod));
    if (product.status === "error") {
        return res.status(400).send(producto);
    } else {
        let add = await cartManager.addProductToCart(parseInt(req.params.id), product.mensaje);
        res.send(add);
    }
})

cartRouter.delete('/:id/products/:id_prod', async (req, res) => {
    if (isNaN(req.params.id && isNaN(req.params.id_prod))) return res.status(400).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
    let cart = await cartManager.deleteProductInCart(parseInt(req.params.id))
    if (cart.status === 'error') {return res.status(400).send(cart)
    }
    let product = await cartManager.deleteProductInCart(parseInt(req.params.id),parseInt(req.params.id_prod))
    product.status === 'error' ? res.status(400).send(product) : res.send(product)
})

module.exports = cartRouter