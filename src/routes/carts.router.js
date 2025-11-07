import express from "express";
import CartManager from "../cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("src/carts.json");

cartsRouter.get("/", async (req, res) => {
    try {
      const {carritos} = await cartManager.getC();
      return res.status(200).json({ state: true, carritos, message: "Lista de carritos" });
    } catch (error) {
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  cartsRouter.get("/:cid", async (req, res) => {
    try {
      const cid = req.params.cid;
      const {encontrado} = await cartManager.getCID(cid);
      return res.status(200).json({ state: true, carrito: encontrado.products, message: "Lista de productos" });
    } catch (error) {
      if(error.message.includes("No se encontró")) return res.status(404).json({state: false, message: error.message})
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  cartsRouter.post("/", async (req, res) => {
    try {
      const carritos = (await cartManager.addC()).carritos;
      return res.status(201).json({ state: true, carritos, message: "Carrito Vacio Creado" });
    } catch (error) {
      return res.status(500).json({ state: false, message: "No se pudo crear el carrito" });
    }
  });
  
  cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const { quantity } = req.body;
      const carritos = (await cartManager.addProductInCart(cid, pid, quantity)).carritos;
      return res.status(200).json({ state: true, carritos, message: `Se agrego el producto ${pid} al carrito ${cid}` });
    } catch (error) {
  
    if(error.message.includes("Cantidad")) return res.status(400).json({state: false, message: error.message})
    if(error.message.includes("No se encontró")) return res.status(404).json({state: false, message: error.message})
    return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  
  export default cartsRouter;