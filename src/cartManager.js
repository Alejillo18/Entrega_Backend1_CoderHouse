import fs from "fs/promises"
import crypto from "crypto"

export default class CartManager{
    constructor(routeC){
        this.routeC = routeC;
        this.initializeC()
    }


generarID(){
    return crypto.randomUUID()
}


    async initializeC(){
        try{
            await fs.access(this.routeC)
            console.log("Se encontro un archivo de carrito, podemos continuar")
        }
        catch(error){
            console.warn(`No se encontro el archivo o estaba corrupto,creamos uno en la ruta ${this.routeC}`)
            await fs.writeFile(this.routeC,"[]","utf-8")
        }
    }

    async getC(){
        try{
        const datos = await fs.readFile(this.routeC,"utf-8");
        const carritos = JSON.parse(datos);
        return {state: true, carritos}
        }
        catch(error){
            throw new Error("Ocurrio un errro al buscar los datos de todos los carritos, error: " + error.message)
        }
    }

    async getCID(cid){
            try{
            const {carritos} = await this.getC();
            const encontrado = carritos.find(u=>u.id === cid);
            if(!encontrado) throw new Error("No existe un carrito con id: "+ cid)
            return {state: true, encontrado }
            }
            catch(error){
                throw new Error("No se encontró el carrito, error: "+ error.message)
            }
    }

    async addC(){
        try{
            const {carritos} = await this.getC();
            const id = this.generarID();
            carritos.push({id,products : []})
            await fs.writeFile(this.routeC, JSON.stringify(carritos,null,2),"utf-8")
            return{state: true, carritos}
        }
        catch(error){
            throw new Error("No se pudo agregar el nuevo carrito, error: " + error.message)
        }
    }

    async addProductInCart(cid,pid,quantity){
        try{
            if(quantity <= 0) throw new Error("Cantidad ingresada incorrecta")
            const {carritos} = await this.getC();
            const carrito = carritos.find(c => c.id === cid);
            if(!carrito) throw new Error("No se encontró un carrito con dicho ID")
            const productoI = carrito.products.findIndex(p => p.id === pid )
            if(productoI === -1)
            {
                carrito.products.push({id:pid, quantity})
            }
            else{
                carrito.products[productoI].quantity += quantity;
            }
            await fs.writeFile(this.routeC,JSON.stringify(carritos,null,2),"utf-8");
            return{state:true, carritos}
        }
        catch(error){
            throw new Error("No se pudo agregar un producto al carrito, error: " + error.message)
        }
    }

}