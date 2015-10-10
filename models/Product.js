var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    borrower: String,
    lender: String,
    description: String,
    productid_id: Number
});


module.exports = mongoose.model('Product', productSchema);
