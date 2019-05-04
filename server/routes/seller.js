const router = require('express').Router();
const Product = require('../models/product');
const checkJWT = require('../middlewares/check.jwt');
const faker = require('faker');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({accessKeyId:'AKIAQBHCUYK432DXPETM', secretAccessKey:'f3crK7y1HWMqMbpsxq700pfBvDjJoRORiokZTh5m'});


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'correct',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});



router.route('/products')
    .get(checkJWT,(req, res, next) => {
        Product.find({owner: req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .exec((err,products) => {
                if(products) {
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products

                    })
                }
            })

    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        console.log(upload);
        console.log(req.file);
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            success: true,
            message: 'Successfully Added the product'
        });
    });


// for testing

router.get('/faker/test',(req,res,next) =>{
    for(i =0; i < 20; i++){
        let product = new Product();
        product.category= '5ccad55731d9a61f55f8714b';
        product.owner= '5ccc6238a5c7112e55ad6f9e';
        product.image= faker.image.cats();
        product.title= faker.commerce.productName();
        product.description= faker.lorem.words();
        product.price= faker.commerce.price();
        product.save();
    }
    res.json({
        message:'Susseccfuly added 20 items'
    })
});

module.exports = router;




