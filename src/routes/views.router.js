import express from "express";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("src/products.json");

viewsRouter.get("/realtimeproducts", async (req,res)=>{
    const { productos } = await productManager.getProducts();
    res.render("realTimeProducts", { productos })
})

viewsRouter.get("/home", async (req,res)=>{
    const { productos } = await productManager.getProducts();
    res.render("home", { productosJson: JSON.stringify(productos) })
})

export default viewsRouter;