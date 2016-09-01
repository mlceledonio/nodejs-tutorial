let request = require('request');
let cheerio = require('cheerio');
let URL = require('url-parse');

const START_URL = "http://www.vaingloryfire.com/vainglory/wiki";
const SEARCH_WORD = "Krul";
const MAX_PAGES_TO_VISIT = 10;

let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let url = new URL(START_URL);
let baseUrl = url.protocol + "//" + url.hostname;
console.log("Base URL: " + baseUrl);

pagesToVisit.push(START_URL);
crawl();

function crawl(){
	if(numPagesVisited >= MAX_PAGES_TO_VISIT){
		console.log("Reached max limit of number of pages to visit.");
		return;
	}
	let nextPage = pagesToVisit.pop();
	if (nextPage in pagesVisited){
		crawl();
	}
	else{
		visitPage(nextPage, crawl);
	}
}

function visitPage(url, callback){
	pagesVisited[url] = true;
	numPagesVisited++;

	console.log("Visiting page " + url);
	request(url, function(error, response, body){
		console.log("Status code: " + response.statusCode);
		if(response.statusCode !== 200){
			callback();
			return;
		}

		let $ = cheerio.load(body);
		let isWordFound = searchForWord($, SEARCH_WORD);
		if(isWordFound){
			console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
		}
		else{
			collectInternalLinks($);
			callback();
		}

	});
}

function searchForWord($, word){
	let bodyText = $('html > body').text().toLowerCase();
	return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($){
	let relativeLinks = $("a[href^='/']");
	console.log("Found " + relativeLinks.length + " relative links on page");
	relativeLinks.each(function(){
		console.log("Pushing " + baseUrl + $(this).attr('href'));
		pagesToVisit.push(baseUrl + $(this).attr('href'));
	});

}

