import express from 'express';
import mongoose from "mongoose";

import Product from "../models/products.model.js"
const router = express.Router();

console.log("Mongo URI: " + process.env.MONGO_URI)

mongoose.connect(`${process.env.MONGO_URI}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

router.get('/', async(req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success: true, data: products });
    } catch(err) {
        console.log("Error in fetching products:", err.message);
        res.status(500).json({success: false, message: "Server Error"})
    }
})
  
router.post('/', async(req, res) => {
    const product = req.body; //user will send this data

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success: false, message: "Please provide all the fiels"})
    }

    const newProduct = new Product(product)

    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch (error){
        console.error("Error in creating a new product", error.message);
        res.status(500).json({success: false, message: "Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
     try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted"})
     } catch(error) {
        console.log("Error in deleting products:", error.message)
        res.status(404).json( {success: false, message: "Product not found" });
     }
});

router.put("/:id", async(req, res) => {
   const  { id } = req.params;

   const product = req.body;

   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({ success: false, message: "Invalid Product Id"});
   }

   try{
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true})
    res.status(200).json({ success: true, data: updatedProduct });
   } catch(err) {
    res.status(500).json({ success: false, message: "Server Error" })
   }
})

export default router;