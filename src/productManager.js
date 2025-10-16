import fs from "fs/promises"

export default class ProductManager{
    constructor(routeP){
        this.routeP = routeP
        this.iniciatilizeProducts()
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
            return{state: false, productos:[], error:error.message};
        }
    }

    async getProductsByPid(pid){
        try{
            const {productos} = (await this.getProducts())
            const encontrado = productos.find(p => p.id === pid)
            if (!encontrado) throw new Error(`No se encontró un producto con id ${pid}`);
            return {state:true, encontrado}
        }
        catch(error){
            console.warn("No se pudo acceder a los datos de los productos, ERROR: ", error.message)
            return{state: false, encontrado:[], error:error.message};
        }
    }
    
    async addProduct(product){
        try{
            const {productos} = await this.getProducts()
            productos.push(product)
            await fs.writeFile(this.routeP,JSON.stringify(productos,null,2),"utf-8")
            return{state:true, productos}
        }
        catch(error){
            console.warn("No se pudo agregar el producto nuevo, ERROR: ",error.message)
            return{state:false, product}
        }
    }

    async updateProduct(pid,updates){
        try{
            const {productos} = await this.getProducts()
            console.log(productos)
            const ind = productos.findIndex((p,i) => p.id === pid)
            if(ind === -1) throw new Error(`No se encontro ningun producto con el id ${pid}`)
            productos[ind] = {...productos[ind],...updates}
            await fs.writeFile(this.routeP,JSON.stringify(productos,null,2),"utf-8")
            return{state:true, productoActualizado : productos[ind]}
        }
        catch(error){
            console.warn(`No se pudo actualizar el producto con id: ${pid}, ERROR: `,error.message)
            return{state:false, pid}
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
            console.warn(`No se pudo eliminar el producto con id: ${pid}, ERROR: `,error.message)
            return{state:false, pid}
        }
    }

}