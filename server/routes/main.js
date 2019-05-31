const router = require('express').Router();
const async = require('async');
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_YLjI9bcY8YKqhO4iofmQe1iX00SNDQp8PA');

const Category = require('../models/category');
const Product = require('../models/product');
const Order = require('../models/order');
const checkJWT = require('../middlewares/check.jwt');



router.get('/products', (req, res, next) => {
    const perPage = 10;
    const page = req.query.page;
    // query kiedy czegos szukamy
    async.parallel([
        function(callback) {
            Product.count({}, (err, count) => {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function(callback) {
            Product.find({})
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) => {
                    if(err) return next(err);
                    callback(err, products);
                });
        }
    ], function(err, results) {
        var totalProducts = results[0];
        var products = results[1];

        res.json({
            success: true,
            message: 'category',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });

});

router.route('/categories')
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            res.json({
                success: true,
                message: "Success",
                categories: categories
            })
        })
    })
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
            success: true,
            message: "Successful"
        });
    });


router.get('/categories/:id', (req, res, next) => {
    const perPage = 10;
    // pierwsza strona jest 0
    const page = req.query.page;
    // dzieki parallel funkcje sa rodzielne i wynik jest res.json
    async.parallel([
        function(callback) {
        // dostajemy totalna ilosc produktow, nalezacych  do konkretnej kategorii
            Product.count({ category: req.params.id }, (err, count) => {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        // populate daje mozliowsc tworzenia instancji do obiektów
        function(callback) {
            Product.find({ category: req.params.id })
                // ilosc produktow na strone
                .skip(perPage * page)
                // 10 produktow na strone limit
                .limit(perPage)
                .populate('category')
                .populate('owner')
                // .populate('reviews')
                .exec((err, products) => {
                    if(err) return next(err);
                    callback(err, products);
                });
        },
        function(callback) {
            Category.findOne({ _id: req.params.id }, (err, category) => {
                callback(err, category)
            });
        }
    ], function(err, results) {
        var totalProducts = results[0];
        var products = results[1];
        var category = results[2];
        // jak jest sukces znalezenia produktów wtedy jest response z tymi polami
        res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });

});

router.get('/product/:id', (req, res, next) => {
    // jak chcemy znalezc jeden produkt z konkretnym id
    Product.findById({ _id: req.params.id })
        .populate('category')
        .populate('owner')
        // .deepPopulate('reviews.owner')
        .exec((err, product) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Product is not found'
                });
            } else {
                if (product) {
                    res.json({
                        success: true,
                        product: product
                    });
                }
            }
        });

    });

    router.post('/payment', checkJWT, (req, res, next) => {
        const stripeToken = req.body.stripeToken;
        const currentCharges = Math.round(req.body.totalPrice * 100);

        stripe.customers
            .create({
                source: stripeToken.id
            })
            .then(function(customer) {
                return stripe.charges.create({
                    amount: currentCharges,
                    currency: 'usd',
                    customer: customer.id
                });
            })
            .then(function(charge) {
                const products = req.body.products;

                let order = new Order();
                order.owner = req.decoded.user._id;
                order.totalPrice = currentCharges;

                products.map(product => {
                    order.products.push({
                        product: product.product,
                        quantity: product.quantity
                    });
                });

                order.save();
                res.json({
                    success: true,
                    message: "Successfully made a payment"
                });
            });
    });


module.exports = router;


