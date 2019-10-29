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
  //make a decision based on the user input
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this-song":
      spotifyThis(userQuery);
      break;
    case "movie-this":
      movieThis(userQuery);
      break;
    case "do-what-it-says":
      doThis();
      break;
    default:
      console.log("I don't understand the request");
      break;
  }
}
//initiate userCommand function
userCommand(userInput, userQuery);

//function for pulling up concert information of band
function concertThis() {
  //url to bands in town api
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";
  //axios to retrieve data from bands in town api
  axios
    .get(queryUrl)
    .then(function(response) {
      // Venue Name
      console.log("Venue Name: " + response.data[0].venue.name);
      console.log(
        //Venue Location
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
      // Venue date and format to MM/DD/YYYY using moment
      var date = response.data[0].datetime;
      date = moment(date).format("MM/DD/YYYY");
      console.log("Date of Event: " + date);
    })
    //check for errors
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
  // if user does not enter a song, userQuery will default to the sign by ace of base
  if (!userQuery) {
    userQuery = "The Sign Ace of Base";
  }
  //access keys to spotify
  var spotify = new Spotify(keys.spotify);
  //request data from spotify with a limit of 5 tracks
  spotify.request(
    "https://api.spotify.com/v1/search?q=track:" +
      userQuery +
      "&type=track&limit=5",
    function(error, response) {
      //if error console log error
      if (error) {
        return console.log(error);
      }
      // loop through tracks and console.log responses for the 5 tracks
      for (var i = 0; i < response.tracks.items.length; i++) {
        var songData = response.tracks.items[i];
        //Artist Name
        console.log("Artist: " + songData.artists[0].name);
        //Song
        console.log("Song: " + songData.name);
        //Preview link of the song
        console.log("URL: " + songData.preview_url);
        //Album Name
        console.log("Album: " + songData.album.name);
        console.log("--------------------------------");
      }
    }
  );
}

//function for requesting movie data
function movieThis() {
  //if no movie provided by user, default to 'Mr. Nobody'
  if (!userQuery) {
    userQuery = "Mr. Nobody";
  }
  // call to OMDB API
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
        // console log any errors
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
