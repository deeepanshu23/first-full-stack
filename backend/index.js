import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/products.model.js';
import path from "path";
import { fileURLToPath } from 'url';

// Configure dotenv with the correct path
dotenv.config({ path: './backend/.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); // allows us to accept JSON data in the req.body

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// API Routes
app.get('/api/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({success: true, data: products });
    } catch(err) {
        console.log("Error in fetching products:", err.message);
        res.status(500).json({success: false, message: "Server Error"})
    }
});

app.post('/api/products', async(req, res) => {
    const product = req.body;

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success: false, message: "Please provide all the fields"})
    }

    const newProduct = new Product(product)

    try {
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch (error) {
        console.error("Error in creating a new product", error.message);
        res.status(500).json({success: false, message: "Server Error" });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Product Id"});
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted"})
    } catch(error) {
        console.log("Error in deleting products:", error.message)
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.put("/api/products/:id", async(req, res) => {
    const { id } = req.params;
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Product Id"});
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true})
        res.status(200).json({ success: true, data: updatedProduct });
    } catch(err) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
});

// Production setup
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});