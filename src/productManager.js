import fs from "fs/promises"
import crypto from "crypto"

export default class ProductManager{
    constructor(routeP){
        this.routeP = routeP
        this.iniciatilizeProducts()
    }

generateID(){
    return crypto.randomUUID()
}

//Validar que se ingresen todos los datos y sean de tipos de datos correctos
 validarProduct(product) {
    if (typeof product !== 'object' || product === null || Array.isArray(product))throw new Error('El producto debe ser un objeto válido');
    try{
        if ("id" in product) {
      throw new Error("No se permite enviar un campo 'id'; este se genera automáticamente.");
    }
        if (typeof product.title !== 'string') {
    throw new Error('title debe existir y ser un string');
  }

  if (typeof product.description !== 'string') {
    throw new Error('description debe existir y ser un string');
  }

  if (typeof product.code !== 'string') {
    throw new Error('code debe existir y ser un string');
  }

  if (typeof product.price !== 'number' || isNaN(product.price) ) {
    throw new Error('price debe existir y ser un número válido');
  }

  if (typeof product.status !== 'boolean'){
    throw new Error('status debe existir y ser un booleano');
  }

  if (typeof product.stock !== 'number' || isNaN(product.stock)) {
    throw new Error('stock debe existir y ser un número válido');
  }

  if (typeof product.category !== 'string') {
    throw new Error('category existir y debe ser un string');
  }

  if (!Array.isArray(product.thumbnails)) {
    throw new Error('thumbnails debe existir y ser un array');
  }

  const allStrings = product.thumbnails.every(item => typeof item === 'string');
  if (!allStrings) {
    throw new Error('todos los elementos de thumbnails deben ser strings');
  }}

  catch(error){
    throw new Error(`Error al validar producto: ${error.message}`)
  }
  
}

//Valido las actualizaciones
 validarCambios(updates){
    try{
        if (typeof updates !== 'object' || updates === null || Array.isArray(updates)|| Object.keys(updates).length === 0) throw new Error('El objeto recibido debe ser un objeto válido');
        if ('id' in updates) throw new Error("No se permite actualizar la propiedad 'id'");
        const camposValidos = {
    title: 'string',
    description: 'string',
    code: 'string',
    price: 'number',
    status: 'boolean',
    stock: 'number',
    category: 'string',
  };
        for(let update in updates){
            if (update === 'thumbnails') {
  if (!Array.isArray(updates[update])) throw new Error("'thumbnails' debe ser un array");
  const allStrings = updates[update].every(item => typeof item === 'string');
  if (!allStrings) throw new Error("Todos los elementos de 'thumbnails' deben ser strings");
} else {
  if (typeof updates[update] !== camposValidos[update]) throw new Error(`El campo '${update}' debe ser de tipo '${camposValidos[update]}'`);
}
        }
    }
    catch(error){
        throw new Error(`Error al validar actualizaciones: ${error.message}`)
    }

}

//Realice un metodo que lee el archivo si existe,
//  caso contrario lo crea con un array vacio
    async iniciatilizeProducts(){
        try{
            await fs.access(this.routeP)
            console.log("Se encontro un archivo de productos, podemos continuar")
        }
        catch(error){
            console.warn(`Archivo no encontrado o corrupto, creamos uno nuevo en la ruta ${this.routeP}`)
            await fs.writeFile(this.routeP,"[]","utf-8")
        }
    }

    async getProducts(){
        try{
            const datos = await fs.readFile(this.routeP,"utf-8")
            const productos = JSON.parse(datos)
            return {state: true , productos}

        }
        catch(error){
            throw new Error("No se pudo acceder a los datos de los productos")
        }
    }

    async getProductsByPid(pid){
        try{
            const {productos} = await this.getProducts()
            const encontrado = productos.find(p => p.id === pid)
            if (!encontrado) throw new Error(`No se encontró un producto con id ${pid}`);
            return {state:true, encontrado}
        }
        catch(error){
            throw new Error(`Error: ${error.message}`)
        }
    }
    
    async addProduct(product){
        try{
            this.validarProduct(product)
            const {productos} = await this.getProducts()
            productos.push({id: this.generateID(), ...product})
            await fs.writeFile(this.routeP,JSON.stringify(productos,null,2),"utf-8")
            return{state:true, productos}
        }
        catch(error){
            throw new Error("No se pudo agregar el producto nuevo, Error: "+ error.message)
        }
    }

    async updateProduct(pid,updates){
        try{
            this.validarCambios(updates);
            const {productos} = await this.getProducts()
            const ind = productos.findIndex((p,i) => p.id === pid)
            if(ind === -1) throw new Error(`No se encontró ningun producto con el id ${pid}`)
            productos[ind] = {...productos[ind],...updates}
            await fs.writeFile(this.routeP,JSON.stringify(productos,null,2),"utf-8")
            return{state:true, productoActualizado : productos[ind]}
        }
        catch(error){
            throw new Error("No se pudo actualizar dicho producto, Error: " + error.message)
        }
    }

    async deleteProduct(pid){
        try{
            const {productos} = await this.getProducts()
            const deleteP = productos.filter(p => p.id !== pid)
            if(productos.length === deleteP.length) throw new Error(`No se pudo eliminar ningun producto con el id ${pid}`)
            await fs.writeFile(this.routeP,JSON.stringify(deleteP,null,2),"utf-8")
            return{state:true, deleteP}
        }
        catch(error){
            throw new Error("No se pudo eliminar el producto, Error: " + error.message)
        }
    }

}