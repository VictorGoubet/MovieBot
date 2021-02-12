"use strict";


function printMovie(x, intent, fb, ds){
  
  if(x==undefined){
    fb.txt(ds,"Sorry, I don't know this movie.. May it was to crazy for me ?") 
  }
  else{
    if(x.many){
    fb.txt(ds,'I have many movies corresponding to this movie. I choose one of these, if it is not the one, be more specific.');
    }
    

    switch(intent){
      case 'release_year':
        fb.txt(ds,`"${x.title}" was released in ${x.date}`)
        break;
      case 'movie_info':
        if(x.image !=null){
          fb.img(ds,x.image)
        }
        fb.txt(ds,`${x.title} was released in ${x.date}\n\nLet's have an overview:\n${x.summary}\n\nIt have a mark of ${x.mark}`)
        break;
      case 'director':
        fb.txt(ds,`"${x.title}" was directed by ${x.director}`)
        break;
        
    }
    
  }

}

module.exports = printMovie;