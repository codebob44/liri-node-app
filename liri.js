// DEPENDENCIES
// =====================================

var dataKeys = require("./keys.js");
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

// FUNCTIONS
// =====================================

var writeToLog = function(data) {
	fs.appendFile("log.txt", '\r\n\r\n');

	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
		if (err) {
			return console.log(err);
		}
		else {
			console.log("log.txt was updated!");	
		}
	});	
}

var getArtistNames = function(artist) {
	return artist.name;
};

var getSpotify = function(songName) {
	if (songName === undefined) {
		songName = 'Master of Puppets';
	};

	spotify.search( { type: 'track', query: songName }, function(err, data) {
		if (err) {
			console.log('The following error came back: ' + err);
			return;
		}

		var songs = data.tracks.items;
		var data = [];

		for (var i = 0; i < songs.length; i++) {
			data.push( {
				'artist(s)': songs[i].artists.map(getArtistNames),
        		'song name: ': songs[i].name,
       		 	'preview song: ': songs[i].preview_url,
        		'album: ': songs[i].album.name,
			});
		}

		console.log(data);
		writeToLog(data);
	});
};

var getTweets = function() {
	var client = new twitter(dataKeys.twitterKeys);
	var params = { screen_name: 'var_bob', count: 20};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {

		if (!err) {
			var data = [];
			for (var i = 0; i < tweets.length; i++) {
				data.push({
					'created at: ' : tweets[i].created_at,
            		'Tweets: ' : tweets[i].text,
				});
			}

			console.log(data);
			writeToLog(data);
		}
	});
};

var getMovie = function(movieName) {
	if (movieName === undefined) {
		movieName = 'Top Gun';
	}

	var queryURL = "http://www.omdbapi.com/?&t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

	request(queryURL, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var data = [];
			var jsonData = JSON.parse(body);

			data.push({
			'Title: ' : jsonData.Title,
            'Year: ' : jsonData.Year,
            'Rated: ' : jsonData.Rated,
            'IMDB Rating: ' : jsonData.imdbRating,
            'Country: ' : jsonData.Country,
            'Language: ' : jsonData.Language,
            'Plot: ' : jsonData.Plot,
            'Actors: ' : jsonData.Actors,
            'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
            'Rotton Tomatoes URL: ' : jsonData.tomatoURL,

			});

			console.log(data);
			writeToLog(data);
		}
	});
}

var doWhatItSays = function() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		console.log(data);
		writeToLog(data);
		var dataArray = data.split(',');

		if (dataArray.length === 2) {
			pick(dataArray[0], dataArray[1]);
		}
		else if (dataArray.length === 1) {
			pick(dataArray[0]);
		}

	});
}

var pick = function(caseData, functionData) {
	switch (caseData) {

		case 'my-tweets' : getTweets();
		break;

		case 'spotify-this-song' : getSpotify(functionData);
		break;

		case 'movie-this' : getMovie(functionData);
		break;

		case 'do-what-it-says' : doWhatItSays();
		break;

		console.log('LIRI does not know that one.');

	}

}

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

// MAIN PROCESS
// =====================================

runThis(process.argv[2], process.argv[3]);


// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

