const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

// MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/Rohit-CRUD";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected successfully to MongoDB");

    // Import model
    const Item = require("./models/itemModel");

    app.post("/api/items", async (req, res) => {
      try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    app.get("/api/items", async (req, res) => {
      try {
        const items = await Item.find();
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.get("/api/items/:id", async (req, res) => {
      try {
        const item = await Item.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.patch("/api/items/:id", async (req, res) => {
      try {
        const updatedItem = await Item.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true } // returns updated document
        );

        if (!updatedItem) {
          return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(updatedItem);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    app.delete("/api/items/:id", async (req, res) => {
      try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
          return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // -------------------------
    // Start server after DB connects
    // -------------------------
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Connection failed:", error.message);
  });
