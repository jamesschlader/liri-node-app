require("dotenv").config();

const keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var request = require("request");

var omdb = require("omdb");

var fs = require("fs");

var moment = require("moment");

var inquirer = require("inquirer");

var operator = "";

var getOperator = [
  {
    type: "input",
    message: "What is your name?",
    name: "username"
  }
];

var choices = [
  {
    type: "list",
    message: "What can I do for you?",
    choices: ["Spotify", "Bandsintown", "OMDB"],
    name: "engine"
  },
  {
    type: "confirm",
    message: "Are you ready?",
    name: "confirm",
    default: true
  }
];

var searchArray = [
  {
    type: "input",
    message: "What do you want to search for?",
    name: "entry"
  }
];

var startOver = [
  {
    type: "list",
    name: "over",
    message: `Would you like to do another search, ${operator}?`,
    choices: ["yes", "no"]
  }
];

var nodeArgs = process.argv.slice(3).join("+");
var useAPI = process.argv[2];
var entry = "";

inquirer.prompt(getOperator).then(function(obj) {
  console.log(obj);
  operator = obj.username;
  getStarted();
});

//choose(useAPI, entry);

////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////

function getStarted() {
  inquirer.prompt(choices).then(obj => getChoices(obj));
}

function getChoices(inquirerResponse) {
  if (inquirerResponse.confirm) {
    console.log();
    console.log("Welcome " + operator);
    console.log(
      "You're going to search the " + inquirerResponse.engine + " database."
    );

    inquirer
      .prompt(searchArray)
      .then(obj => sendSearch(inquirerResponse.engine, obj));
  }
}

function sendSearch(text1, obj) {
  choose(text1, obj.entry);

  fs.appendFile("log.txt", text1 + "," + obj.entry + ";", err => {
    if (err) throw err;
    //console.log('The "data to append" was appended to file!');
  });
}

function goAgain() {
  inquirer.prompt(startOver).then(obj => {
    if (obj.over === "yes") {
      getStarted();
    } else {
      console.log(`It was nice working with you ${operator}. See ya around.`);
    }
  });
}

function choose(text1, text2) {
  switch (text1) {
    case "Bandsintown":
      bands(text2);

      break;
    case "Spotify":
      spotify(text2);

      break;

    case "OMDB":
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
    // console.log("This is the whole she-bang: " + console.dir(show));

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
      choose("fail", entry);
    }
    goAgain();
  });
} //end bands()

function spotify(entry) {
  //console.log(entry);

  var spotify = new Spotify(keys.spotify);

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
      choose("fail", entry);
    } else if (data["Title"] === "Undefined") {
      console.log("Add the Mr. Nobody garbage here.");
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
    goAgain();
  });
}
// end omdb()
