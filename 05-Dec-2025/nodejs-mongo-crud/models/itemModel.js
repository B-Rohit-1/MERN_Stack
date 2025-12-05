// models/itemModel.js

const mongoose = require("mongoose");

// Define the Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// Create the Model from the Schema
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
