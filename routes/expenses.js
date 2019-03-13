const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load expences model
const Expense = require("../models/Expense");
// Load response helper
const prepareSelect2Options = require("../helpers/prepareSelect2Options");
// Load validation
const validateExpenseInput = require("../validation/expense");

/**
 * @route GET /
 * @desc Shows the last 10 expences
 * @access Private
 * @todo ACL
 */
router.get("/", (req, res) => {
   Expense.find().sort("-date").limit(10)
       .then((results) => {
           res.json(results);
       })
       .catch((err) => {
           res.status(404).json(err);
       })
});

/**
 * @route PUT /
 * @desc Adds an expense
 * @access Private
 * @todo ACL
 */
router.post("/", (req, res) => {
    /**
     * @todo Validation
     * @type {{amount: (Document.amount|amount|{type, min, required}|PaymentCurrencyAmount), tags: boolean, counterpart: (Document.counterpart|counterpart|{type, required}), date: *, category: *}}
     */
    const {errors, isValid} = validateExpenseInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newExpense = {
        amount: req.body.amount,
        tags: req.body['tags[]'],
        counterpart: req.body.counterpart,
        date: req.body.date,
        category: req.body.category
    }

    new Expense(newExpense)
        .save()
        .then(expense => res.json(expense))
        .catch(err => res.status(500).json(err));
});

/**
 * @route GET /categories
 * @desc Returns all categories
 * @access Private
 * @todo ACL
 */
router.get("/categories", (req, res) => {
   Expense.find().distinct('category')
       .then(categories => res.json(prepareSelect2Options(categories)))
       .catch(err => res.status(404).json(err))
});

/**
 * @route GET /tags
 * @desc Returns all tags
 * @access Private
 * @todo ACL
 */
router.get("/tags", (req, res) => {
    Expense.find().distinct('tags')
        .then(tags => res.json(prepareSelect2Options(tags)))
        .catch(err => res.status(404).json(err))
});

/**
 * @route GET /counterparts
 * @desc Returns all counterparts
 * @access Private
 * @todo ACL
 */
router.get("/counterparts", (req, res) => {
    Expense.find().distinct('counterpart')
        .then(counterparts => res.json(prepareSelect2Options(counterparts)))
        .catch(err => res.status(404).json(err))
});

module.exports = router;