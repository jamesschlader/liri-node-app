require("dotenv").config();

const keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var request = require("request");

var omdb = require("omdb");

var fs = require("fs");

var moment = require("moment");

var nodeArgs = process.argv;
var useAPI = "";
var entry = "";
//nodeArgs.push(entry);

for (var i = 2; i < nodeArgs.length; i++) {
  if (i > 1 && i < nodeArgs.length) {
    if (i === 2) {
      useAPI = nodeArgs[i];
    } else {
      if (i === nodeArgs.length - 1) {
        entry = entry + nodeArgs[i];
      } else {
        entry = entry + nodeArgs[i] + "+";
      }
    }
  } else {
    entry += nodeArgs[i];
  }
}

choose(useAPI, entry);

////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////

function choose(text1, text2) {
  switch (text1) {
    case "concert-this":
      bands(text2);
      break;

    case "spotify-this-song":
      spotify(text2);
      break;

    case "movie-this":
      getMovie(text2);
      break;

    case "do-what-it-says":
      dwits(text2);
      break;

    case "fail":
      console.log();
      console.log(
        "Your input of " +
          text2 +
          " failed to yield a result. Please try again."
      );
      console.log();

    /* fs.readFile("log.txt", (err, data) => {
        if (err) throw err;
        console.log(data);
      });
      */
    default:
      console.log();
      console.log(
        "So sorry your search for " +
          text2 +
          " didn't work. Check the spelling of your search term before continuing."
      );
      console.log();
      console.log(
        "Enter the command 'concert-this' followed by an artist name OR 'spotify-this-song' followed by a song title OR 'movie-this' followed by a movie title in order to get an intelligible response. Just type your search in, spaces and all. Try again."
      );
      console.log();
  }
} //end function choose

function bands(entry) {
  var options = {
    method: "GET",
    url: "https://rest.bandsintown.com/artists/" + entry + "/events?",
    qs: { app_id: "96818ce21839cd4310bb4d154bbe17e3" },
    headers: {
      "Postman-Token": "5d0f5b0d-39f9-49b9-a9bb-9b7236942e23",
      "Cache-Control": "no-cache"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    var show = JSON.parse(body);

    if (show.length > 1) {
      show.forEach(event => {
        if (event.venue.region === "UT") {
          console.log();
          console.log("Upcoming shows in Utah for " + event.lineup[0] + ":");

          console.log(event.venue.city + ", " + event.venue.region);
          console.log(event.venue.name);

          var eventTime = moment(event.datetime).format("MMM DD GGGG h:mm A");

          console.log(eventTime);
          console.log();
        }
      });

      console.log();

      var counter = 0;

      show.forEach(event => {
        if (event.venue.region !== "") {
          if (event.venue.region !== "UT") {
            if (counter === 0) {
              console.log(
                "Upcoming shows in the USA for " + show[0].lineup[0] + ":"
              );

              console.log();
              counter++;
            }
            console.log(event.venue.city + ", " + event.venue.region);
            console.log(event.venue.name);

            var eventTime = moment(event.datetime).format("MMM DD GGGG h:mm A");

            console.log(eventTime);
            console.log();
          }
        } else {
          counter++;
        }
      });
      if (counter === show.length) {
        console.log();
        console.log(show[0].lineup[0] + " has no upcoming shows in the USA.");
        console.log();
      }
    } else {
      console.log("Bandsintown didn't find any events for " + entry + ".");
    }
  });
} //end bands()

function spotify(entry) {
  console.log();
  //console.log(entry);

  var spotify = new Spotify(keys.spotify);

  if (entry === "") {
    entry = "I Want it That Way";
  }

  spotify.search({ type: "track", limit: 1, query: entry }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (data) {
      console.log();
      console.log(
        "The artist is: " + data.tracks.items[0].album.artists[0].name
      );
      console.log(
        "The song is orginally from the album " +
          data.tracks.items[0].album.name
      );
      console.log(
        "You can preview the song by following this url: " +
          data.tracks.items[0].preview_url
      );
      console.log();
    }
    bands(data.tracks.items[0].album.artists[0].name);
  });
} //end spotify function

function getMovie(entry) {
  var movie = "http://www.omdbapi.com/?apikey=trilogy&t=" + entry;

  request(movie, function(error, response, body) {
    var data = JSON.parse(body);

    //console.log(data);

    if (data["Response"] === "False") {
      fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }

        var item1 = data.split("\n");
        var item2 = item1[1].split(",");
        //console.log("item2[1] = " + item2[1]);

        getMovie(item2[1]);
        // choose("fail", entry);
      });
    } else if (data["Title"] === "Undefined") {
      //console.log("Add the Mr. Nobody garbage here.");

      fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }

        var item1 = data.split("\n");
        var item2 = item1[1].split(",");
        // console.log("item2[1] = " + item2[1]);

        getMovie(item2[1]);
      });
    } else if (!error && response.statusCode === 200) {
      const title = "Title";
      const year = "Year";
      const rated = "imdbRating";
      const rating = "Ratings";
      const country = "Country";
      const language = "Language";
      const plot = "Plot";
      const actors = "Actors";

      console.log();
      console.log(
        data[title] +
          " was released in " +
          data[year] +
          ". Its IMDB rating is " +
          data[rated] +
          "."
      );
      if (data[rating][1] === undefined) {
        console.log("There isn't a Rotten Tomatoes rating for this title.");
      } else {
        console.log(
          "Rotten Tomatoes rates it at " + data[rating][1]["Value"] + "."
        );
      }

      console.log(
        data[title] +
          " was made in " +
          data[country] +
          " and is in " +
          data[language] +
          "."
      );
      console.log(data[plot]);
      console.log("Starring " + data[actors] + ".");
      console.log();
    } else {
      choose("fail", entry);
    }
  });
}
// end omdb()

function dwits(entry) {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var item1 = data.split("\n");
    var item2 = item1[0].split(",");

    spotify(item2[1]);
  });
} //end dwits()
