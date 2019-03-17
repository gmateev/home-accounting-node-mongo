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
        category: req.body.category,
        comment: req.body.comment
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
   Expense.aggregate([
       { "$project": { "category":1 }},
       { "$unwind": "$category" },
       { "$group": { "_id": "$category", "count": { "$sum": 1 } }}
   ]).sort({"count": -1})
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
    Expense.aggregate([
        { "$project": { "tags":1 }},
        { "$unwind": "$tags" },
        { "$group": { "_id": "$tags", "count": { "$sum": 1 } }}
    ]).sort({"count": -1})
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
    Expense.aggregate([
        { "$project": { "counterpart":1 }},
        { "$unwind": "$counterpart" },
        { "$group": { "_id": "$counterpart", "count": { "$sum": 1 } }}
    ]).sort({"count": -1})
        .then(counterparts => res.json(prepareSelect2Options(counterparts)))
        .catch(err => res.status(404).json(err))
});

router.get("/sum", (req, res) => {
   Promise.all(
       [
           Expense.aggregate([
               /**
                * @todo Match
                 */
               {
                   $group: {
                       _id: {
                           date: "$date",
                           // tags: "$tags",
                           category: "$category"
                       },
                       total: {$sum: "$amount"}
                   }
               }
           ]).sort({"_id.date":1}),

            Expense.aggregate([{
                /**
                 * @todo Match
                 */
                $group: {
                    _id: null,
                    total: {$sum: "$amount"}
                }
            }])
       ]
   )
   .then(([results, total]) => {
       let data = {}
       results.forEach(item => {
           if(typeof data[item._id.category] == "undefined") {
               data[item._id.category] = [];
           }
           data[item._id.category].push([
               item._id.date.getTime(), item.total
           ]);
       });
        res.json({
           results: data,
           total: total[0].total
        });
    })
   .catch(err => res.status(400).json(err));
});

router.get("/sum/:groupBy/:startDate/:endDate", (req, res) => {
    Promise.all(
        [
            Expense.aggregate([
              {
                $match: {
                  date:  {
                    $gte: new Date(req.params.startDate),
                    $lte: new Date(req.params.endDate)
                  }
                }
              },
                {
                    $group: {
                        _id: {
                            date: "$date",
                            // tags: "$tags",
                            category: "$"+req.params.groupBy
                        },
                        total: {$sum: "$amount"}
                    }
                }
            ]).sort({"_id.date":1}),

          Expense.aggregate([
            {
              $match: {
                date:  {
                  $gte: new Date(req.params.startDate),
                  $lte: new Date(req.params.endDate)
                }
              }
            },
            {
              $group: {
                _id: {
                  category: "$"+req.params.groupBy
                },
                total: {$sum: "$amount"}
              }
            },
            {
              $project: {
                "_id": 0,
                "group": "$_id.category",
                "total": 1
              }
            }
          ]).sort({"total":-1}),

            Expense.aggregate([
              {
                $match: {
                  date:  {
                    $gte: new Date(req.params.startDate),
                    $lte: new Date(req.params.endDate)
                  }
                }
              },
              {
                $group: {
                    _id: null,
                    total: {$sum: "$amount"}
                }
            }])
        ]
    )
        .then(([results, gridData, total]) => {
          /**
           * @todo rewrite this shit
           * @type {{}}
           */
            let data = {};
            results.forEach(item => {
                if(typeof data[item._id.category] == "undefined") {
                    data[item._id.category] = [];
                }
                data[item._id.category].push([
                    item._id.date.getTime(), item.total
                ]);
            });
            res.json({
                results: data,
                total: total[0].total,
                gridData: gridData
            });
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;