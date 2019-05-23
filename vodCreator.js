//vodCreator (c) 2019 Brandon McKenzie / BEC-TV

const fetch = require("node-fetch");
const dotenv = require("dotenv");
var result = dotenv.config();

if(result.error) {
  console.log("FATAL ERROR\n\nFailed to load .env file with required setting.  Please see README for details");
  return 0;
}

const url = `${process.env.URL || ""}/CablecastAPI/v1/`;
const credentials = process.env.CREDENTIALS || "";
const savedSearch = process.env.SAVEDSEARCH;
const limit = process.env.LIMIT || 10;

console.log(`Requesting results from ${url} from saved search ${savedSearch}`)

fetch(`${url}shows/search/advanced/${savedSearch}`)
	.then(res => res.json())
	.then(json => {
		var shows = json.savedShowSearch.results;
		var vod_limit = Math.min(limit, shows.length);
		console.log(`Got ${shows.length} shows, creating VODs for first ${vod_limit} results`);
  
  	for(var i = 0; i < vod_limit; i++) {
  		createVODforShowIfNoneExist(shows[i]);
  	}
  });

const createVODforShowIfNoneExist = showID => {
  //5/22/19 (BM): The CablecastAPI will allow you to create more than
  // one VOD for a given show.  This isn't possible in the UI, only
  // in the API.  The subsequent files typically fail to transcode, 
  // and don't show up correctly in the UI.  We will check to see
  // if the requested ShowID already has a VOD, if so, we will skip 
  // creating it.  This makes the script idempotant which is important
  // since we are going to call it on a schedule

  fetch(`${url}shows/${showID}?include=vods`)
  .then(res => res.json())
  .then(json => {
      if(json.show.vods.length == 0)
        createVODforShow(showID);
      else
        console.log(`\tShow ${showID} already has a VOD record, shipping...`);
  });
};

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
