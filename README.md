vodCreator
==============

Script to bulk enable VOD in TRMS cablecast based on a saved search

Copyright 2019 - Brandon McKenzie / BEC-TV

Installation
------------

1. Clone or download the code from github.
2. Install Node.js
3. Run npm install
4. Create a `.env` file with your settings.  Save the file in the same directory as the `vodCreator.js` file.  The following settings are defined:
* URL - The address of the Cablecast server to access.  Starts with either `http://` or `https://`.  Do not include a trailing `/` at the end!
* CREDENTIALS - The username:password to use to access Cablecast.  The provided user must have access to the `Schedule & Shows` permission.
* SAVEDSEARCH - The ID of the saved search that contains the shows that should have VOD enabled.  You must create a search in Cablecast that defines what shows you'd like to have enabled.
* LIMIT - (optional) - The maximum number of VODs to enable per script run.  NOTE: As of this writing (3/15/19) Cablecast has no concept of priority for VOD processing.  If you use this script to enable VOD on 500 shows, no other items will be processed until those 500 have finished.  Best practice would be to do a small number (5-10) at a time, so that you don't create a weeks or months long backlog.
* See example later in this document for reference.
5. run `node vodCreator.js` to execute the script.

Example .env file:
------------------
````javascript
CREDENTIALS=bob:12345
URL=https://cablecast.example.com
LIMIT=10
SAVEDSEARCH=129189
````

Notes
-----

This script was designed and tested with Cablecast 6.4.2.  It is possible that older/newer versions of Cablecast will require edits.