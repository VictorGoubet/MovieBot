const getWeather = require('./weather/getWeather');
const printWeather = require('./weather/printWeather');
const getMovieInfo = require('./movie/getMovieInfo');
const printMovie = require('./movie/printMovie')

const mapIntent = function(data, FB){
  switch(data.intent){

            // WEATHER
            case 'get_weather':
                getWeather(data.entities.city_name)
                .then(x=>{FB.txt(data.sender, printWeather(x, data.entities))},
                      x=>{FB.txt(data.sender,x)})
                break;
            
            // MOVIE
            case 'director':
            case 'movie_info':
            case 'release_year':
                getMovieInfo(data.entities)
                .then(x=>{printMovie(x, data.intent, FB, data.sender)},
                      x=>{FB.txt(data.sender,x)})
                break;
            
            // OTHER
            case 'start':
                let name = data.entities.user_name !=undefined?data.entities.user_name:''
                FB.txt(data.sender, `Hi ${name}! I am CRAZY bot ! The new version of my predecessor FUNKY bot, may you have already hear about him ? Now I use NLP to understand you! It is really better than regex.. Moreover I can tell you the weather but also give you information about movie! So crazy..`);
                break;
 
            case 'exit':
                FB.txt(data.sender, "CRAZY bye !");
                break;

            default:
                FB.txt(data.sender, "Sorry I don't undertstand what you mean, may it was too crazy for me ?");
                break;
        }

}


module.exports = mapIntent;



