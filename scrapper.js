let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

request("http://www.vaingloryfire.com/vainglory/wiki/heroes/adagio", function(error, response, body){
	if(error){
		console.log("Error: " + error);
	}
	console.log("Status code: " + response.statusCode);

	let $ = cheerio.load(body);

	// $('div#chapter').each(function(index){
	// 	let name = $(this).find('span').text().trim();
	// 	console.log("Name: " + name);
	// });
	$('div#chapter>div>table>tr>td:nth-child(2)>table').each(function(indA){
		$(this).find('td').each(function(indB){
			let info = $(this).text().trim();
			if(info !== ''){
				fs.appendFileSync('element.txt', info + '\n');
			}
		});
	});

});