const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const productsRouter = require('./router/productsRouter')
const cartRouter = require('./router/cartRouter')
app.use(express.json()); 
app.use(express.urlencoded({extended:true})) 
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

app.use((req, res) => {
    res
        .status(400)
        .send ({ error: -2, descripcion: `ruta ${req.baseUrl} ${req.url} metodo ${req.method} no implementada` })})