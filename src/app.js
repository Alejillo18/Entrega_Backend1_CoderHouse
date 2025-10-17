import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";
import express from "express";

const cartManager = new CartManager("./src/carts.json");
const productManager = new ProductManager("./src/products.json");

const app = express();
app.use(express.json());

app.get("/api/products/", async (req, res) => {
  try {
    const { productos } = await productManager.getProducts();
    return res.status(200).json({ state: true, productos, mesagge: "Lista de productos" });
  } catch (error) {
    return res.status(500).json({ state: false, message: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
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

app.post("/api/products/", async (req, res) => {
  try {
    const producto = req.body;
    await productManager.addProduct(producto);
    return res.status(201).json({ state: true, producto, message: `Producto Agregado: ${producto.title}` });
  } catch (error) {
    if (error.message.includes("validar producto") || error.message.includes("El producto debe ser un objeto válido")) {
      return res.status(400).json({ state: false, message: error.message });
    }
    return res.status(500).json({ state: false, message: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const producto = (await productManager.updateProduct(pid, updates)).productoActualizado;
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

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const producto = (await productManager.deleteProduct(pid)).deleteP;
    return res.status(200).json({ state: true, producto, message: "Producto Eliminado" });
  } catch (error) {
    if (error.message.includes("No se pudo eliminar ningun producto")) {
      return res.status(404).json({ state: false, message: error.message });
    }
    return res.status(500).json({ state: false, message: error.message });
  }
});

app.get("/api/carts", async (req, res) => {
  try {
    const {carritos} = await cartManager.getC();
    return res.status(200).json({ state: true, carritos, message: "Lista de carritos" });
  } catch (error) {
    return res.status(500).json({ state: false, message: error.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const {encontrado} = await cartManager.getCID(cid);
    return res.status(200).json({ state: true, carrito: encontrado.products, message: "Lista de productos" });
  } catch (error) {
    if(error.message.includes("No se encontró")) return res.status(404).json({state: false, message: error.message})
    return res.status(500).json({ state: false, message: error.message });
  }
});

app.post("/api/carts/", async (req, res) => {
  try {
    const carritos = (await cartManager.addC()).carritos;
    return res.status(201).json({ state: true, carritos, message: "Carrito Vacio Creado" });
  } catch (error) {
    return res.status(500).json({ state: false, message: "No se pudo crear el carrito" });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
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

app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
