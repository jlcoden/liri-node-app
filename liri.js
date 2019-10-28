require("dotenv").config();
//pull data from keys.js
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
//stored user input
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join("+");

// function for command options
function userCommand(userInput, userQuery) {
  //make a decision based on the user input in the command
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this":
      spotifyThis(userQuery);
      break;
    case "movie-this":
      movieThis(userQuery);
      break;
    case "do-what-it-says":
      doThis();
      break;
    default:
      console.log(" I don't understand the request");
      break;
  }
}
//initiate userCommand function
userCommand(userInput, userQuery);

//function for pulling up concert information of band
function concertThis() {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";

  console.log(userQuery);
  console.log(userInput);
  console.log(queryUrl);

  axios
    .get(queryUrl)
    .then(function(response) {
      console.log("Venue Name: " + response.data[0].venue.name);
      console.log(
        "Venue location: " +
          " Latitude:" +
          response.data[0].venue.latitude +
          ", Longitude: " +
          response.data[0].venue.longitude +
          ", City:" +
          response.data[0].venue.city +
          ", Region:" +
          response.data[0].venue.region +
          ", Country: " +
          response.data[0].venue.country
      );
      var date = response.data[0].datetime;
      date = moment(date).format("MM/DD/YYYY");
      console.log("Date of Event: " + date);
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//function for spotifying song
function spotifyThis() {
  if (!userQuery) {
    userQuery = "the sign ace of base";
  }

  var spotify = new Spotify(keys.spotify);

  spotify.request(
    "https://api.spotify.com/v1/search?q=track:" +
      userQuery +
      "&type=track&limit=5",
    function(error, response) {
      if (error) {
        return console.log(error);
      }

      for (var i = 0; i < response.tracks.items.length; i++) {
        var songData = response.tracks.items[i];

        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        console.log("--------------------------------");
      }
    }
  );
}

//function for requesting movie data of movie
function movieThis() {
  if (!userQuery) {
    userQuery = "Mr. Nobody";
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

  axios
    .get(queryUrl)
    .then(function(response) {
      //Title of the movie
      console.log("Movie Title: " + response.data.Title);
      // // * Year the movie came out
      console.log("Release Year: " + response.data.Year);
      // * IMDB Rating of the movie
      console.log("IMDB Rating: " + response.data.imdbRating);
      // * Rotten Tomatoes Rating of the movie
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[2].Value);
      // * Country where the movie was produced
      console.log("Country Produced In: " + response.data.Country);
      // * Language of the movie
      console.log("Language: " + response.data.Language);
      // * Plot of the movie
      console.log("Plot: " + response.data.Plot);
      // * Actors in movie
      console.log("Actors: " + response.data.Actors);
    })

    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//function for doing something random from random.txt file
function doThis() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    //console.log(dataArr[0]);
    userQuery = dataArr[1];
    spotifyThis(userQuery);
    // userCommand(dataArr[0], dataArr[1]);
  });
}
