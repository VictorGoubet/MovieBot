
"use strict ";
const axios = require ("axios");

const apikey = process.env.movieToken; 

const getMovieID = (entities) => {

    let mv_name = entities.movie_name.replace(/é/g, 'e')
                                     .replace(/è/g, 'e')
                                     .replace(/ /g, '+')
    apiurl= `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${mv_name}&primary_release_year=${entities.release_year}`
    return new Promise(async (resolve, reject)=>{
        try{
          
            let movieInfo = (await axios.get(apiurl)).data.results;
            let id = movieInfo.length>0?movieInfo[0].id:null;
            resolve([id, movieInfo.length>1]);
        }
        catch(error){
            reject(error);
        } 
    });
}


const getMoreDetails = (entities, id, many) => {
  apiurl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}`
  return new Promise(async (resolve, reject)=>{
        try{
          let obj
          if(id!=null){
            let x = (await axios.get(apiurl)).data;
            obj = {
              title:x.original_title,
              summary:x.overview,
              date:x.release_date,
              mark:x.vote_average,
              image:x.poster_path!=null?'https://image.tmdb.org/t/p/w500/'+x.poster_path:null,
              director:x.production_companies.length>0?x.production_companies[0].name:null,
              many
            }  
          } 
          
          resolve(obj);
        }
        catch(error){
            reject(error);
        }
    });

    

}

const getMovieInfo = async (entities) => {
  let x = await getMovieID(entities)
  let info = await getMoreDetails(entities, x[0], x[1])
  return info
}


module.exports = getMovieInfo;