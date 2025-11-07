import express from "express";
import ProductManager from "../productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("src/products.json");

productsRouter.get("/", async (req, res) => {
    try {
      const { productos } = await productManager.getProducts();
      return res.status(200).json({ state: true, productos, mesagge: "Lista de productos" });
    } catch (error) {
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  productsRouter.get("/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const { encontrado } = await productManager.getProductsByPid(pid);
      return res.status(200).json({ state: true, producto: encontrado, mesagge: `Producto con PID: ${pid}` });
    } catch (error) {
      if (error.message.includes("No se encontró")) {
        return res.status(404).json({ state: false, message: error.message });
      }
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  productsRouter.post("/", async (req, res) => {
    try {
      const producto = req.body;
      const io = req.app.get("socketio");
      await productManager.addProduct(producto);
      const { productos } = await productManager.getProducts();
      io.emit("productos", productos);
      return res.status(201).json({ state: true, producto, message: `Producto Agregado: ${producto.title}` });
    } catch (error) {
      if (error.message.includes("validar producto") || error.message.includes("El producto debe ser un objeto válido")) {
        return res.status(400).json({ state: false, message: error.message });
      }
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  productsRouter.put("/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const updates = req.body;
      const io = req.app.get("socketio");
      const producto = (await productManager.updateProduct(pid, updates)).productoActualizado;
      const { productos } = await productManager.getProducts();
      io.emit("productos", productos)
      return res.status(200).json({ state: true, producto, message: `Producto Actualizado: ${producto.title}` });
    } catch (error) {
      if (error.message.includes("validar actualizaciones") || error.message.includes("objeto válido")) {
        return res.status(400).json({ state: false, message: error.message });
      } else if (error.message.includes("No se encontró ningun producto")) {
        return res.status(404).json({ state: false, message: error.message });
      }
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  
  productsRouter.delete("/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const io = req.app.get("socketio");
      const producto = (await productManager.deleteProduct(pid)).deleteP;
      const {productos} = await productManager.getProducts();
      io.emit("productos", productos)
      return res.status(200).json({ state: true, producto, message: "Producto Eliminado" });
    } catch (error) {
      if (error.message.includes("No se pudo eliminar ningun producto")) {
        return res.status(404).json({ state: false, message: error.message });
      }
      return res.status(500).json({ state: false, message: error.message });
    }
  });
  

  export default productsRouter;