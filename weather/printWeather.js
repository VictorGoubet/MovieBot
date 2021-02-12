"use strict ";

let h = (new Date()).getHours()+1
let now = (h<9?'0':'') +h+':00:00';

function get_temp_state(temp){
    let res;
    if(temp < 5){
        res = 'very cold';
    }
    else if(temp < 15){
        res = "cold";
    }
    else if(temp < 25){
        res = "hot";
    }
    else{
        res = 'very hot';
    }
    return res;
}


function printWeather(x, entities){

  let i = 1
  res = '';
  let info_time = ''
  
  if(entities['time']!=undefined){
    i = (entities.time.includes('yesterday')) ?0: (entities.time.includes('tomorrow'))? 2:1
    i += (entities.time.includes('after')) ?1:0
    info_time += entities.time
  }
  data = x.days[i].hours.filter(x =>x.datetime == now)[0]
  let compute_state = get_temp_state(data.temp)

  if(entities.state!=undefined){ 
    let state = entities.state.includes('y')?entities.state.slice(0,-1).toLowerCase():entities.state.toLowerCase();

    if(state.includes('hot') || state.includes('cold')){
      res += compute_state.includes(state)? 'A crazy yes! ':'Not really, I may make a mistake but.. '
    }
    else{
        res += data.conditions.toLowerCase().includes(state)?'A funky yes! ':'I don\'t think so, I may make a mistake but.. ';
    }
  }
  
  res += `It is ${compute_state} in ${entities.city_name} ${info_time} with ${Math.round(data.temp)}°C and ${data.conditions}`
  return res;
}

module.exports = printWeather;