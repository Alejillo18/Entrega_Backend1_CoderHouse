import crypto from "crypto";

export class Cart{
    constructor(products = []){
        this.products = products;
        this.id = crypto.randomUUID();
    }   
    }


//Estos objetos son los que van dentro del objeto Cart, los cuales tienen el id 
// y la cantidad de los mismos

export  class PAndQuantity{
    constructor(pid,quantity = 1){
        this.pid = pid;
        this.quantity = quantity;
    }
}