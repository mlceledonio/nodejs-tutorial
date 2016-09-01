let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

const START_URL = "http://www.vaingloryfire.com/vainglory/wiki/heroes";

function scrapHeroName() {

    return new Promise(function(resolve, reject) {
        request(START_URL, function(error, response, body) {
            if (error) {
                console.log("Error: " + error);
                reject(new Error(error));
            } else if (response.statusCode === 200) {
                console.log("Status Code: " + response.statusCode);
                resolve(body);
            }
        });

    })
}

function scrapHeroDetails(heroName) {
    request(START_URL + "/" + heroName, function(error, response, body) {
        if (error) {
            console.log("Error: " + error);
        }
        console.log("Status code: " + response.statusCode);
        console.log("Scrapping " + heroName);
        let $ = cheerio.load(body);

        $('div#chapter>div>table>tr>td:nth-child(2)>table').each(function(indA) {
            $(this).find('td').each(function(indB) {
                let info = $(this).text().trim();
                if (info !== '') {
                    fs.appendFileSync('hero.txt', info + '\n');
                }
            });
        });

        fs.appendFileSync('hero.txt', '--------------------' + '\n');
    });
}

scrapHeroName()
    .then(function(body) {
        return new Promise(function(resolve, reject) {
        	let heroes = [];
            let $ = cheerio.load(body);
            $('div.grid > div.card-wrap').each(function(index) {
                let name = $(this).find('div').text().trim();
                heroes.push(name.toLowerCase());
            });
            resolve(heroes);
        });
    })
    .then(function(heroes){
    	for(key of heroes){
    		scrapHeroDetails(key);
    	}
    });