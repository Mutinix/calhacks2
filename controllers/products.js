
var ProductSchema = require('../models/Product');
var User = require('../models/User');
var product = require('../product');
var Postmates = require('postmates');
var postmates = new Postmates('cus_KWaTpUK-km_Dq-', '21d5ae72-c418-40a2-987c-b3d2c822cedb');
var price_quote ;
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
    productid_id: id_count++,
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

exports.getBorrowProduct = function(req, res) {

    var number = req.param('number');
    ProductSchema.find(function(err, products){
        if(err) return console.error(err);
        if(typeof products[number]==='undefined'){
        res.status(404).json({status:'error'});
        }
        else{
            User.findOne({ _id: products[number].lender}, function(err, u){
            if (err) return err;
            console.log("Pickup Address: " + u.profile.location);
            console.log("Delivery Address: " + req.user.profile.location);
            var delivery = {
                pickup_address: "2400 Bancroft Way Berkeley, CA 94704",
                dropoff_address: "2227 Piedmont Ave Berkeley, CA 94720"
            };
            postmates.quote(delivery, function(err, resp) {
				price_quote = resp.body.fee;
                res.render('placeOrder', {delivery: delivery});
            });
        });
        }
    });
};


exports.postBorrowProduct= function(req,res){
	var user = req.user;
	var number = req.param('number');
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/borrowproduct');
        }
    
	var delivery = {
		manifest: req.body.manifest,
		pickup_name: req.body.pickup_name,
		pickup_address: req.body.pickup_address,
		pickup_phone_number: req.body.pickup_phone_number,
		pickup_business_name: req.body.pickup_business_name,
		pickup_notes: req.body.pickup_notes,
		dropoff_name: req.body.dropoff_name,
		dropoff_address: req.body.dropoff_address,
		dropoff_phone_number: req.body.dropoff_phone_number,
		dropoff_business_name: req.body.dropoff_business_name,
		dropoff_notes: req.body.dropoff_notes,
		quote_id: req.body.quote_id
		};
	postmates.new(delivery, function(err, res) {
		console.log("hello");
	});
	
	console.log(req.body.quote_id);

	postmates.get(req.body.quote_id, function(err, res){
		console.log(res.body);
	});
	res.redirect('/products/'+number+'/placeOrder/fare');
};
exports.getFare = function(req,res){
	if(!req.user){res.redirect('/');}
	res.render('fare', {charge: price_quote });
};

