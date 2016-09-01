let rp = require("request-promise");
let options = {
	method: 'GET',
	uri: "http://www.vaingloryfire.com/vainglory/wiki/heroes/adagio/abilities",
	resolveWithFullResponse: true
};

rp(options)
	.then(function (response){
		console.log(response.body);
	})
	.catch(function (err){
		console.log("error");
	});