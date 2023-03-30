import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { Barometer } from "barometer";
import { goals } from "user-activity";
import { today } from "user-activity";
import { me as appbit } from "appbit";
import { battery } from "power";
import { charger } from "power";
import { units } from "user-settings";

let myClock = document.getElementById("myClock");
let ampm = document.getElementById("ampm");

const hrm = new HeartRateSensor({ frequency: 1 });
const body = new BodyPresenceSensor();
let hr = document.getElementById("hr");


let value = document.getElementById("value");
let calarc = document.getElementById("cal-fg");
let kcal = document.getElementById("kcal");
let distarc = document.getElementById("distance-fg");
let dist = document.getElementById("dist");
let charge = document.getElementById("charge");
let pow = document.getElementById("power-fg");
let powbg = document.getElementById("power-bg");
let txtpow = document.getElementById("txtpow");

var hbrinstance = document.getElementById("hbrinstance");
var charinstance = document.getElementById("charinstance");

clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

let valValue = 0;

display.onchange = () => updatediaplay();
updatediaplay();

function updatediaplay(){
  if (appbit.permissions.granted("access_activity")) {
  kcal.text = today.adjusted.calories + " kcal";
   let anglepercentagecal = today.adjusted.calories / goals.calories;
   let anglecal = 41 * anglepercentagecal;
   if(anglecal > 41){
     anglecal = 41;
   }
   calarc.sweepAngle = anglecal;
 }

  if (appbit.permissions.granted("access_activity")) {
    if(units.distance == "metric"){
      dist.text = (today.adjusted.distance/1000).toFixed(2) + "km";
    }
    else if(units.distance == "us"){
      dist.text = (0.621371 * today.adjusted.distance/1000).toFixed(2) + "mi";
    }
   let anglepercentagedist = today.adjusted.distance / goals.distance;
   let angledist = 60 * anglepercentagedist;
   if(angledist > 60){
     angledist = 60;
   }
   distarc.sweepAngle = angledist;
 }
  
  let power = Math.floor(battery.chargeLevel);
  let anglecharge = 30 * power/100;
  txtpow.text = power + "%";
  pow.sweepAngle = -anglecharge;
  if(power >= 60){
    pow.style.fill = "#00FF00";
    powbg.style.fill = "#00FF00";
    txtpow.style.fill = "#00FF00";
  }
  else if(power >= 25 && power < 60){
    pow.style.fill = "#ff7300";
    powbg.style.fill = "#ff7300";
    txtpow.style.fill = "#ff7300";
  }
  else{
    pow.style.fill = "#c80408";
    powbg.style.fill = "#c80408";
    txtpow.style.fill = "#c80408";
  }
  
  valValue = "-----";
  if(pressTime == 0){
    stat.text = ".ALT.";
    value.text = "-----ft";
  }
  else if(pressTime == 1){
    barometer.stop();
    stat.text = "STEPS";
    if (appbit.permissions.granted("access_activity")){
      value.text = today.adjusted.steps;
      valValue = today.adjusted.steps;
    }
  }
  else if(pressTime == 2){
    barometer.stop();
    stat.text = "FLOOR";
    if (appbit.permissions.granted("access_activity")){
      value.text = today.adjusted.elevationGain;
      valValue = today.adjusted.elevationGain;
    }
  }
  value.text = valValue;
 
}



clock.ontick = (evt) => {
  updateClock();
  let hours = evt.date.getHours();
  if(preferences.clockDisplay == "24h"){
    ampm.text = "  ";
  }
  else{
    if(preferences.clockDisplay == "12h" && hours > 12){
      hours = hours - 12;
      ampm.text = "PM";
    }
    else if(preferences.clockDisplay == "12h" && hours < 12){
      ampm.text = ("AM");
    }
    if(preferences.clockDisplay == "12h" && hours == 12){
      ampm.text = "PM";
    }
  }
  
  if(preferences.clockDisplay == "12h" && hours == 0){
    myClock.text = ("12") + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2);
    ampm.text = ("AM");
  }
  else if(preferences.clockDisplay == "24h" && hours == 0){
    myClock.text = ("00") + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2);
    ampm.text = ("  ");
  }
  else{
    myClock.text = (hours) + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2);
  }
  
  let today = new Date();
  let day = document.getElementById("day");
  let date = document.getElementById("date");
  let month = document.getElementById("month");
  let year = document.getElementById("year");
  
  date.text = today.getDate();
  year.text = today.getFullYear();
  
  switch (today.getDay()) {
  case 0:
    day.text = "Sun";
    break;
  case 1:
    day.text = "Mon";
    break;
  case 2:
     day.text = "Tue";
    break;
  case 3:
    day.text = "Wed";
    break;
  case 4:
    day.text = "Thu";
    break;
  case 5:
    day.text = "Fri";
    break;
  case 6:
    day.text = "Sat";
    break;
  }
  
  
  switch (today.getMonth()) {
  case 0:
    month.text = "-Jan-";
    break;
  case 1:
    month.text = "-Feb-";
    break;
  case 2:
     month.text = "-Mar-";
    break;
  case 3:
    month.text = "-Apr-";
    break;
  case 4:
    month.text = "-May-";
    break;
  case 5:
    month.text = "-Jun-";
    break;
  case 6:
    month.text = "-Jul-";
    break;
  case 7:
    month.text = "-Aug-";
    break;
  case 8:
    month.text = "-Sep-";
    break;
  case 9:
    month.text = "-Oct-";
    break;
  case 10:
    month.text = "-Nov-";
    break;
  case 11:
    month.text = "-Dec-";
    break;
  }  
  
  
  if(charger.connected){
    charinstance.animate("enable");
  }
  else{
    charinstance.animate("disable");
  }
  if(Math.floor(battery.chargeLevel) <= 15 && display.onchange){
    charinstance.animate("enable");
    let power = Math.floor(battery.chargeLevel);
    let anglecharge = 30 * power/100;
    txtpow.text = power + "%";
    pow.sweepAngle = -anglecharge;
    pow.style.fill = "#c80408";
    powbg.style.fill = "#c80408";
    txtpow.style.fill = "#c80408";
  }

};



if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
            hbrinstance.animate("disable");
            hr.text = "--"; 
      hrm.stop();
    } else {
      setInterval(function() {
      }, 1000);
      if (HeartRateSensor) {
          hrm.addEventListener("reading", () => {
          hbrinstance.animate("enable"); // Specify the name of the event to trigger
          hr.text = hrm.heartRate;
          });
          display.addEventListener("change", () => {
          // Automatically stop the sensor when the screen is off to conserve battery
          display.on ? hrm.start() : hrm.stop();
          });
          hrm.start();
        }
    }
  });
  body.start();
}


let React = document.getElementById("React");
let stat = document.getElementById("stat");
let pressTime = 0;
let initial = 0;
const barometer = new Barometer({ frequency: 1 });



if (Barometer) {
  
  barometer.addEventListener("reading", () => {
    if(units.distance == "metric"){
      value.text = ((altitudeFromPressure(barometer.pressure / 100)*0.3048).toFixed(0) + "m");
    }
    else if(units.distance == "us"){
      value.text = (altitudeFromPressure(barometer.pressure / 100).toFixed(0) + "ft");
    }
    
  });
  display.addEventListener("change", () => {
    if(display.on && pressTime == 0){
      barometer.start();
    }
    else if(!display.on || pressTime != 0){
      barometer.stop();      
    }
    
  });
  
}
function altitudeFromPressure(pressure) {
  return (1 - (pressure/1013.25)**0.190284)*145366.45;
}


React.onclick = function(e) {
  pressTime = pressTime + 1;
  if(pressTime > 2){
    pressTime = 0;
  }
  
  if(pressTime == 0){
    stat.text = ".ALT.";
    value.text = "-----";
    barometer.start();
  }
  else if(pressTime == 1){
    barometer.stop();
    stat.text = "STEPS";
    if (appbit.permissions.granted("access_activity")){
      value.text = today.adjusted.steps;
      valValue = today.adjusted.steps;
    }
  }
  else if(pressTime == 2){
    barometer.stop();
    stat.text = "FLOOR";
    if (appbit.permissions.granted("access_activity")){
      value.text = today.adjusted.elevationGain;
      valValue = today.adjusted.elevationGain;
    }
  }
}