
var ProductSchema = require('../models/Product');
var product = require('../product');
//var products = require('../data');
id_count = 0; //FIX TO MAKE UNIQUE
exports.listProducts = function(req,res){

	ProductSchema.find(function(err, products){
		if(err) return console.error(err);
		res.render('products', {title: 'All Products', products: products});

	});

};
/** GET / ADD PRODUCT**/
exports.getAddProduct = function(req,res){
	if(!req.user){res.redirect('/');}
	res.render('addProduct', {title: 'Add a product'});
};
/** POST / ADD PRODUCT**/
exports.postAddProduct = function(req,res){

	var errors = req.validationErrors();
	if (errors) {
    req.flash('errors', errors);
    return res.redirect('/products');
	}
	var productData = {
    name: req.body.name,
    borrower: null,
    lender: req.body.username,
    description: req.body.description,
    productid_id: ++id_count
	};
	var product1 = new ProductSchema(productData);
	console.log(product1);
    product1.save(function(err) {
      if (err) return next(err);
      res.redirect('/');
      });
};

/** POST / BORROW PRODUCT**/
exports.borrowProduct = function(req, res) {
    var user = req.user;
    console.log("REQ")
    console.log(req);
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/borrowproduct');
    }


    ProductSchema
    .findOne({ productid_id: req.body.pid }, function(err, prod){
        prod.borrower = user._id.toString();
        prod.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Product Borrowed!'});
            res.redirect('/products');
        });
    });
};