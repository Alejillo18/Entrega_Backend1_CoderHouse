import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import {Server} from "socket.io";
import ProductManager from "./productManager.js";

import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));


const productManager = new ProductManager("src/products.json");

app.set("socketio", io);

io.on("connection", async (socket) => {
  try {
    const { productos } = await productManager.getProducts();
    socket.emit("productos", productos);
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
  }
  
  socket.on("deleteProduct", async (productID) => {
    try {
      const { state } = await productManager.deleteProduct(productID);

      if (state) {
        const { productos } = await productManager.getProducts();
        io.emit("productos", productos);
      } else {
        socket.emit("addProductFeedback", {success: false, message: "Error al eliminar el producto."});
      }
    } catch (error) {
      console.error(`Error procesando deleteProduct para ID ${productID}:`, error);
    }
  });

  socket.on("addProduct", async (productData) => {
    try {
      if (productData.stock < 0) {
          socket.emit("addProductFeedback", {success: false, message: "Error: El stock recibido es negativo."});
          return;
      }
      
      const result = await productManager.addProduct(productData);

      if (result && result.state) {
        const { productos } = await productManager.getProducts();
        io.emit("productos", productos);
        socket.emit("addProductFeedback", {success: true, message: `Producto "${productData.title}" agregado con éxito.`});
      } else {
        socket.emit("addProductFeedback", {success: false, message: result.message || "Error al agregar producto."});
      }
    } catch (error) {
      socket.emit("addProductFeedback", {success: false, message: "Error interno del servidor."});
    }
  });
});

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);


server.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});