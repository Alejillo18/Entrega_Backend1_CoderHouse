import crypto from "crypto"

export default class Product{
    constructor({ title, description, code, price, status, stock, category, thumbnails }){
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
        this.id = crypto.randomUUID()
    }
}