const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');

router.route('/categories')
    .get((req,res,next)=>{
        Category.find({}, (err,categories) =>{
            res.json({
                success: true,
                message: 'Successful',
                categories: categories
            })
        })
    })
    .post((req,res,next) => {
        let category = new Category();
        category.name =req.body.category;
        category.save();
        res.json({
            success: true,
            message: 'Successful'
        });
    });



router.get('/categories/:id', (req, res, next)=>{
    const perPage =10;

});
module.exports = router;
