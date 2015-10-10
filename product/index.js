var Product = function(){
	this.data = {
		name: null,
		borrower: null,
		lender: null,
		description: null,
		productid_id: null
	};
	this.fill = function(info){
		for(var prop in this.data){
		if(this.data[prop] !== 'undefined'){
			this.data[prop] = info[prop];
			console.log("passing in info");
			}
		}
	};
	this.getInformation = function(){
		console.log(this.data);
		return this.data;
	};

};


module.exports = function(info){
	
	var instance = new Product();
	instance.fill(info);
	return instance;
};


