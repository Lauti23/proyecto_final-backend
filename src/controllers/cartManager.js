const fs = require('fs')
const pathToFile = './src/data/carts.json'

class CartsManager {
    createCart = async (cart) => {
        try {
            let id = 1
            if(fs.existsSync(pathToFile)) {
                let data = await fs.promises.readFile(pathToFile, 'utf-8')
                let carts = JSON.parse(data)
                if(carts.length > 0) id = carts[carts.length - 1].id + 1
                cart = {
                    id,
                    timestamp: new Date().toLocaleString(),
                    ...cart
                }
                carts.push(cart)
                await fs.promises.writeFile(pathToFile, JSON.stringify(carts, null, 2))
            } else {
                cart = {
                    id,
                    timestamp: new Date().toLocaleString(),
                    ...cart
                }
            }
            return cart
        } catch (error) {
            return {error: 0, descripcion: "Error al acceder a la base de datos"}
        }     
    }

    deleteCart = async (id) => {
        id = parseInt(id)
        if(fs.existsSync(pathToFile)) {
            let isFound = false
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let carts = JSON.parse(data)
            let newCarts = products.filter(item => item.id !== id)
            if(carts.length !== newCarts.length) isFound = true
            if(!isFound) return {error: 0, descripcion: "Carrito no encontrado"}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newCarts, null, 2))
            return newCarts
        } else {
            return {error: 0, descripcion: "No hay carritos"}
        }
    }

    getCartProducts = async (id) => {
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, "utf-8");
            let carritos = JSON.parse(data);
            let cart = carritos.find((cart) => cart.id === id);
            if (cart) return { status: "success", mensaje: `Se encontro el carrito con el id:(${id})`, carrito: cart };
            return { status: "error", mensaje: `No existe carrito con el id:(${id})` };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }

    addProductToCart = async (id, prod) => {
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, "utf-8");
            let carts = JSON.parse(data);
            let cartId = carts.find((cart) => cart.id === id);
            cartId.productos.push({ ...prod });
            await fs.promises.writeFile(pathToFile, JSON.stringify(carts, null, 2));
            return { status: "Success", mensaje: `Se agrego el producto id:(${prod.id}) al carrito con id:(${id})` };
        } else {
            return { status: "Error", mensaje: "No existe la base de datos" };
        }
    }

    deleteProductInCart = async (cartId, prodId) => {
        if (fs.existsSync(pathToFile)){
            let data = await fs.promises.readFile(pathToFile, 'utf-8');
            let carts = JSON.parse(data);
            let cartId = carts.findIndex((cart) =>cart.id === cartId);
            let product = carts[cartId].products.some((prod) => prod.id == prodId);
            if (!product) {
                return {status: 'Error', message: 'No existe el producto en este carrito'}
            }
            let newObject = carts[cartId].products.filter((prod) => prod.id !== prodId);
            if (cartId !== -1) {
                carts[cartId].products = newObject;
            }
            let cartUpdate = carts[cartId];
            await fs.promises.writeFile(pathToFile, JSON.stringify(carts, null, 2));
            return {status: 'Success', message: 'El producto fue eliminado', cartUpdate}
        } else {
            return {status: 'error', message: 'No existe en la base de datos'}
        }
    }
}

module.exports = CartsManager