require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join("+");

function userCommand(userInput, userQuery) {
  //make a decidsion based on the user input in the command
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this":
      spotifyThis();
      break;
    case "movie-this":
      movieThis();
      break;
    // default:
    // console.log(" I don't understand the request");
    // break;
  }
}
userCommand(userInput, userQuery);

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
      console.log("Date of Event: ");
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

function spotifyThis() {
  if (!userQuery) {
    userQuery = "the sign ace of base";
  }

  var spotify = new Spotify(keys.spotify);

  spotify.request(
    "https://api.spotify.com/v1/search?q=track:" +
      userQuery +
      "&type=track&limit=10",
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
      }
    }
  );
}

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
