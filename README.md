# liri-node-app

The liri.node.app takes a limited number of arguments from the command line to generate some interesting output through the use of some APIs loaded via npm's. 

User Instructions:

At the command line, type "node liri.js" and then one of four commands: spotify-this-song, concert-this, movie-this, or do-what-it-wants. The user can then enter additional text after the first 3 commands which will take that text and use it as a basis for a search on Spotify, Bandsintown, and OMDB, respectively.

Predicted Output:

spotify-this-song: When the user searches for it song, it will display the artist's name, what album it is from, and, if available, a link to the song. The app then immediately calls the 'concert-this' command passing the artist name. 

If the user's search term doesn't yield a result, the user will be told as much with instructions provided on how to input search terms for a another try. If no search term is provided, the data for "I Want It That Way" will be displayed.

concert-this: This command accepts an artit's name and checks whether that artist has any future perfomances. If the artist does have upcoming shows, ones in Utah will be displayed first. If the artist has any other shows in the USA, those will also be displayed. All displayed performances will indicate what city, state, venue, date, and time of the performance. No international shows will be displayed.

If the user's search term doesn't yield a result, the user will be told as much with instructions provided on how to input search terms for a another try.

movie-this: This command results in a paragraph of information about the searched movie, including the year of release, what country or countries in which it was filmed, what languages are spoken in it, a list of actors, a blurb about the movie's plot, and the IMDB and Rotten Tomatoes ratings, if available.

If the user's search term doesn't yield a result, the user will be told as much with instructions provided on how to input search terms for a another try. If no search term is offered, the data for "Mr. Nobody" will be shown.

do-what-it-wants: This command returns the spotify results for "I Want It That Way."

Bonus :Every search, even ones with empty strings or ones which fail to get data, are stored along with the associated command, in the 'log.txt' file.
