require("dotenv").config();

const keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var useAPI = process.argv[2];

var request = process.argv[3];

//determine which api to use

switch (useAPI) {
  case "concert-this":
    bands();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    imdb();
    break;

  case "do-what-it-says":
    dwits();
    break;

  default:
    console.log(
      "Enter the command 'concert-this' followed by an artist name OR 'spotify-this-song' followed by a song title OR 'movie-this' followed by a movie title in order to get an intelligible response. The artist, song, or movie needs to be enclosed by quotes '' but the not the associated command. Try again."
    );
}

////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////

function bands() {
  console.log("Haven't finished this content yet.");
} //end bands()

function spotify() {
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", limit: 1, query: request }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (data) {
      //console.log(data);
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
    }
  });
} //end spotify function

function imdb() {
  console.log("Haven't finished this content yet.");
} //end imdb()

function dwits() {
  console.log("Haven't finished this content yet.");
} //end dwits()

/*  Make it so liri.js can take in one of the following commands:

   * `concert-this`

   * `spotify-this-song`

   * `movie-this`

   * `do-what-it-says`

1. `node liri.js concert-this <artist/band name here>`

   * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

     * Name of the venue

     * Venue location

     * Date of the Event (use moment to format this as "MM/DD/YYYY")

2. `node liri.js spotify-this-song '<song name here>'`

   * This will show the following information about the song in your terminal/bash window

     * Artist(s)

     * The song's name

     * A preview link of the song from Spotify

     * The album that the song is from

   * If no song is provided then your program will default to "The Sign" by Ace of Base.

   * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.

   * The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:

   * Step One: Visit <https://developer.spotify.com/my-applications/#!/>

   * Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

   * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

   * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).

3. `node liri.js movie-this '<movie name here>'`

   * This will output the following information to your terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

     * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

     * It's on Netflix!

   * You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.

4. `node liri.js do-what-it-says`

   * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

     * Edit the text in random.txt to test out the feature for movie-this and my-tweets

### BONUS

* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

* Make sure you append each command you run to the `log.txt` file. 

* Do not overwrite your file each time you run a command.

### Reminder: Submission on BCS

* Please submit the link to the Github Repository!

- - -

*/
