function MultipleHashtags() {
  // the name of the sheet within your document, by default this is: "sheet1". 
var sheetName = "Sheet1";
  //The hashtags you want to track
var hashtagArray = ["hashtag1","hashtag2","hashtag3","hashtag4"];
  
  for(var i = 0; i < hashtagArray.length; i++) { insertData(sheetName, hashtagArray[i]); };

// Get Date field filled
function insertData(sheetName, Hashtag) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName); 
  sheet.appendRow([Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"), PostTagName(Hashtag), getPostCount(Hashtag), getMostRecentDate(Hashtag), getURL(Hashtag)]); 
  var range = sheet.getRange("A2:H")
  range.sort([{column: 1, ascending: false}]);
  Utilities.sleep(250);
} 

//Return Hashtag Name
function PostTagName(tag) { 
  var url = "https://www.instagram.com/explore/tags/"+tag+"/?__a=1";
  var response = UrlFetchApp.fetch(url).getContentText();
  return JSON.parse(response).graphql.hashtag.name;
 }
  
//get Media Count for Hashtag
function getPostCount(tag) { 
  var url = "https://www.instagram.com/explore/tags/"+tag+"/?__a=1";
  var response = UrlFetchApp.fetch(url).getContentText();
  return JSON.parse(response).graphql.hashtag.edge_hashtag_to_media.count;

 }
 
//Get Most Recent Post Date
function getMostRecentDate(tag) { 
  var url = "https://www.instagram.com/explore/tags/"+tag+"/?__a=1";
  var response = UrlFetchApp.fetch(url).getContentText();
  var mostRecent = parseInt(JSON.parse(response).graphql.hashtag.edge_hashtag_to_media.edges[0].node.taken_at_timestamp);
  //return mostRecent;
  var postTimeArray = convertTimestamp(mostRecent);
  var postDate = postTimeArray[0];
  var postTime = postTimeArray[2];
  return postDate;
}

  //save URL for Hashtag
function getURL(tag) { 
  var url = "https://www.instagram.com/explore/tags/"+tag;
  return url
 }
  
}


/**
/ CONVERT IG TO READABLE TIMESTAMP
*/
function convertTimestamp(timestamp) {
  var allValues = [];
var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday"];
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
  
  var dayWord = weekday[d.getDay()];
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	// ie: 2013-02-18, 8:35 AM	
  time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
  convertedDate =  yyyy + '-' + mm + '-' + dd;
  convertedDay =   dayWord;
  convertedTime = h + ':' + min + ' ' + ampm;
  allValues.push(convertedDate,convertedDay,convertedTime);
	return allValues;
}
