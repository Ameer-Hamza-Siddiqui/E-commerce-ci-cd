const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

router.post("/seed", async (req, res) => {
  await Product.deleteMany({});
  const products = await Product.insertMany([
    {
      name: "Laptop",
      description: "Powerful laptop for work and study",
      price: 80000,
      category: "Electronics",
      countInStock: 10
    },
    {
      name: "Mobile Phone",
      description: "Smartphone with good camera",
      price: 50000,
      category: "Electronics",
      countInStock: 20
    },
    {
      name: "Headphones",
      description: "Wireless headphones with clear sound",
      price: 5000,
      category: "Accessories",
      countInStock: 15
    }
  ]);
  res.json(products);
});

router.post("/", protect, admin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.delete("/:id", protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = router;
