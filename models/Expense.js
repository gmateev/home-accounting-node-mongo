const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ExpenseSchema = new Schema({
    amount: {
        type: Number,
        min: 1,
        required: true
    },
    counterpart: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    },
    comment: String
});

module.exports = User = mongoose.model("expenses", ExpenseSchema);
