
var ProductSchema = require('../models/Product');
var product = require('../product');
id_count = 0; //FIX TO MAKE UNIQUE
exports.listProducts = function(req,res){

	ProductSchema.find(function(err, products){
		if(err) return console.error(err);
		res.render('products', {title: 'All Products', products: products});

	});

};
/*** INDIVIDUAL PRODUCTS ***/
exports.individualProduct = function(req, res){
	var number = req.param('number');
	ProductSchema.find(function(err, products){
		if(err) return console.error(err);
		if(typeof products[number]==='undefined'){
		res.status(404).json({status:'error'});
		}
		else{res.render('individualProduct', {product: products[number]});}
	});
};
/** GET / ADD PRODUCT**/
exports.getAddProduct = function(req,res){
	if(!req.user){res.redirect('/');}
	res.render('addProduct', {title: 'Add a product'});
};
/** POST / ADD PRODUCT**/
exports.postAddProduct = function(req,res){
	req.assert('price', 'Must specify a price for product').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
    req.flash('errors', errors);
    return res.redirect('/products');
	}
	var productData = {
    name: req.body.name,
    borrower: null,
    lender: req.user._id,
    description: req.body.description,
    productid_id: ++id_count,
    imgUrl: req.body.imgUrl,
    price: req.body.price,
    isBorrowed: false
	};
	var product1 = new ProductSchema(productData);
    product1.save(function(err) {
      if (err) return next(err);
      res.redirect('/products');
      });
};

/** POST / BORROW PRODUCT**/
exports.borrowProduct = function(req, res) {
    var user = req.user;
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/borrowproduct');
		}
	
	ProductSchema.findOne({ _id: req.body.pid }, function(err, prod){
		prod.isBorrowed = true;
		console.log(prod.isBorrowed);
        prod.borrower = user._id.toString();
        prod.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Product Borrowed!'});
            res.redirect('/products');
        });
    });

};
