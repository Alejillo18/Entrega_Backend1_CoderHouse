import fs from "fs/promises"
import { PAndQuantity } from "./cart.js";


export default class CartManager{
    constructor(routeC){
        this.routeC = routeC;
        this.initializeC()
    }
//De mismo modo con el carrito
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
            console.warn("No se pudieron obtener los datos de los carritos, ERROR: ", error.message)
            return{state:false, carritos: []}
        }
    }

    async getCID(cid){
            try{
            const carritos = (await this.getC()).carritos;
            const encontrado = carritos.find(u=>u.id === cid);
            return {state: true, encontrado}
            }
            catch(error){
                console.warn("No se pudieron obtener los datos de los carritos, ERROR: ", error.message)
                return{state:false, carritos: []}
            }
    }

    async addC(c){
        try{
            const carritos = (await this.getC()).carritos;
            carritos.push(c)
            await fs.writeFile(this.routeC, JSON.stringify(carritos,null,2),"utf-8")
            return{state: true, carritos}
        }
        catch(error){
            console.warn("No se pudo agregar un carrito, ERRRO: ", error.message)
            return{state:false, c}
        }
    }

    async addQuantity(cid,pid){
        try{
            const carritos = (await this.getC()).carritos;
            const carrito = carritos.find(c => c.id === cid);
            const productoI = carrito.products.findIndex(p => p.pid === pid )
            if(!carrito) throw new Error("No se encontro un carrito con dicho ID")
            if(productoI === -1)
            {
                const nuevoProd = new PAndQuantity(pid,1)
                carrito.products.push(nuevoProd)
            }
            else{
                carrito.products[productoI].quantity += 1;
            }
            await fs.writeFile(this.routeC,JSON.stringify(carritos,null,2),"utf-8");
            return{state:true, carritos}
        }
        catch(error){
            console.warn("No se encontro el carrito, al cual desea agregar el producto,Error: ", error.message)
            return{state: false, cid,pid}
        }
    }

}