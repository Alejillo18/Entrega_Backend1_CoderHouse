import  ProductManager  from "./js/productManager.js";
import  CartManager  from "./js/cartManager.js";
import Product from "./js/product.js";
import { Cart, PAndQuantity } from "./js/cart.js";
import express from "express"

const cartManager =  new CartManager("./archivos/carts.json");
const productManager = new ProductManager("./archivos/products.json");


const app = express();
app.use(express.json());


//MANEJO DE PRODUCTOS

app.get("/api/products/", async (req,res)=>{
    try{
        const productos = await productManager.getProducts()
        res.status(200).json({state: true, productos, mesagge: "Lista de productos"})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})
app.get("/api/products/:pid", async (req,res)=>{
    try{
        const pid = req.params.pid;
        const producto = await productManager.getProductsByPid(pid)
        res.status(200).json({state: true, producto, mesagge: `Producto con PID: ${pid}`})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})


app.post("/api/products/",async (req,res)=>{
    try{
        const producto = new Product(req.body);
        await productManager.addProduct(producto);
        res.status(201).json({state: true, producto, mesagge: `Producto Agregado: ${producto.title}`})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})


app.put("/api/products/:pid", async (req,res)=>{
    try{
        const pid = req.params.pid;
        const updates = req.body;
        const producto = (await productManager.updateProduct(pid,updates)).productoActualizado;
        res.status(200).json({state: true, producto, mesagge: `Producto Actualizado: ${producto.title}`})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})


app.delete("/api/products/:pid", async (req,res)=>{
    try{
        const pid = req.params.pid;
        const producto = (await productManager.deleteProduct(pid)).deleteP;
        res.status(200).json({state: true, producto, mesagge: `Producto Eliminado`})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})


//MANEJO DE CARRITOS

app.get("/api/carts", async (req,res)=>{
    try{
        const carritos = await cartManager.getC();
        res.status(200).json({state: true, carritos, mesagge: "Lista de carritos"})
    }
    catch(error){
        res.status(500).json({state: false, mesagge: error.mesagge})
    }
})






app.listen(8080, ()=>{
    console.log("Servidor iniciado en el puerto 8080")
})

//Testeamos las funcionalidades de cartManager y ProductManager

/* const producto1 = new Product("ps5","Consola","ps52023",100,true,2,"E",["Url falsa"])
const producto2 = new Product("Xbox Series X","Consola","xbox2023",120,true,5,"E",["Url Xbox"])
const producto3 = new Product("Nintendo Switch","Consola","switch2023",80,true,3,"E",["Url Nintendo"])
const producto4 = new Product("iPhone 15","Smartphone","iphone2023",150,true,10,"E",["Url iPhone"])

await productManager.addProduct(producto1);
await productManager.addProduct(producto2);
await productManager.addProduct(producto3);
await productManager.addProduct(producto4);
console.table( await productManager.getProducts())

const canastaProductos1 = new PAndQuantity("f363bba9-4cc0-46e3-af88-62635b25ebdd",2)
const canastaProductos2 = new PAndQuantity("c439addb-7312-49f2-82c8-aabc24b9ef04",5)
const canastaProducto3 =  new PAndQuantity("a49bfb0b-1605-4708-a4db-70fae6d10217")

const carrito1 = new Cart([canastaProductos1,canastaProductos2]);
const carrito2 = new Cart([canastaProducto3]);
await cartManager.addC(carrito1);
await cartManager.addC(carrito2); 


await cartManager.addQuantity("03971e9a-45f8-4248-93bb-e1380a876624","a49bfb0b-1605-4708-a4db-70fae6d10217")
await cartManager.addQuantity("d89dd530-7b29-44fe-ae4a-7b958c6302d4","636ed4cc-76e5-44a7-aea3-87928f40ed56") */