//vodCreator (c) 2019 Brandon McKenzie / BEC-TV

const fetch = require("node-fetch");
const dotenv = require("dotenv");
var result = dotenv.config();

if(result.error) {
  console.log("FATAL ERROR\n\node-fetchFailed to load .env file with required setting.  Please see README for details");
  return 0;
}

const url = `${process.env.URL || ""}/CablecastAPI/v1/`;
const credentials = process.env.CREDENTIALS || "";
const savedSearch = process.env.SAVEDSEARCH;
const limit = process.env.LIMIT || 10;

console.log(`Requesting results ${url} from saved search ${savedSearch}`)

fetch(`${url}shows/search/advanced/${savedSearch}`)
	.then(res => res.json())
	.then(json => {
		var shows = json.savedShowSearch.results;
		var vod_limit = Math.min(limit, shows.length);
		console.log(`Got ${shows.length} shows, creating VODs for first ${vod_limit} results`);

  	for(var i = 0; i < vod_limit; i++) {
  		createVODforShow(shows[i]);
  	}
  });

const createVODforShow = showID => {
  console.log(`\tCreating VOD for show ${showID}`);

  const body = { vod: { show:showID.toString(), vodConfiguration:"1" }};

  fetch(`${url}vods`, { 
  	method: "POST",
  	body: JSON.stringify(body),
    headers: {
    	"Content-Type":"application/json", 
    	"Accepts":"application/json", 
    	"Authorization":`Basic ${Buffer.from(credentials).toString("base64")}`} 
  })
  .then(res => res.json())
  .then(json => console.log(`\tCreated VOD for show ${showID}`));
}