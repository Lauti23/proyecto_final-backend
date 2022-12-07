const fs = require('fs')
const pathToFile = './src/data/products.json'

class ProductsManager {
    getAll = async () => {
        if (!fs.existsSync(productFile)) return {error: 0, message: 'No existe en la base de datos'}
        if (fs.existsSync(productFile)) {
            let data = await fs.promises.readFile(productFile, 'utf-8')
            let products = JSON.parse(data)
            return {status: 'Success', message: products}
        } else {
            return {status: 'error', message: "Error al acceder a los productos"}
    }
    }

    getById = async (id) => {
        id = parseInt(id)
        if(!fs.existsSync(pathToFile)) return {error: 0, descripicion: "No hay productos almacenados"}
        let data = await fs.promises.readFile(pathToFile, 'utf-8')
        let products = JSON.parse(data)
        let product = products.find(item => item.id === id)
        if(!product) return {error: 0, descripicion: "Producto no encontrado"}
        return product
    }

    create = async (product) => {
        try {
            if (!product.name || !product.description || !product.code || !product.url || !product.price || !product.stock) return { status: "error", message: "Faltan datos por completar" };
            let id = 1
            if(fs.existsSync(pathToFile)) {
                let data = await fs.promises.readFile(pathToFile, 'utf-8')
                let products = JSON.parse(data)
                if (products.length > 0) id = products[products.length-1].id + 1
                product = {
                    id,
                    timestamp: new Date().toLocaleString(),
                    ...product
                }
                products.push(product)
                await fs.promises.writeFile(pathToFile, JSON.stringify([product], null, 2))
            } else {
                product = {
                    id,
                    timestamp: new Date().toLocaleString(),
                    ...product
                }
                await fs.promises.writeFile(pathToFile, JSON.stringify([product], null, 2))
            }
            return product          
        } catch (err) {
            return {error: 0, descripicion: "Error al acceder a la BD"}
        }
    }

    update = async (id, updatedProduct) => {
        id = parseInt(id)
        if(fs.existsSync(pathToFile)) {
            isFound = false
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.map(item => {
                if(item.id === id) {
                    isFound = true
                    return {
                        id,
                        ...updatedProduct
                    }
                } else return item
            })
            if(!isFound) return {error: 0, descripicion: "Producto no encontrado"}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newProducts, null, 2))
            return newProducts.find(item => item.id === id)
        } else {
            return {error: 0, descripicion: "No hay productos almacenados"}
        }
    }

    delete = async (id) => {
        id = parseInt(id)
        if(fs.existsSync(pathToFile)) {
            let isFound = false
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter(item => item.id !== id)
            if(products.length !== newProducts.length) {isFound = true}
            if(!isFound) return {error: 0, descripicion: "Producto no encontrado"}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newProducts, null, 2))
            return newProducts
        } else {
            return {error: 0, descripicion: "No hay productos almacenados"}
        }
    }
}

module.exports = ProductsManager