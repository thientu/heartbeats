var heartbeats = require('../main');


exports.newHeart = function(test){
  test.expect(1);
  heartbeats.createHeart(1000, "globalBeat");
  test.equal((heartbeats.heart("globalBeat") !== undefined), true);
  test.done();
};

exports.createHeart = function(test){

  var heart = heartbeats.heart("globalBeat");

  test.expect(1);

  var obj = {
    pulseA : heart.newPulse(),  
    pulseB : heart.newPulse(),  
  };

  var iA = setInterval(function(){
      obj.pulseA.beat();
  }, 500);

  var iB = setInterval(function(){
      obj.pulseB.beat();
  }, 5000);

  var iC = setInterval(function(){
      for(var pulse in obj){
        if(obj[pulse].missedBeats() > 3){
          console.log(pulse, "lag is over 3000ms:", obj[pulse].lag(), "missedBeats:", obj[pulse].missedBeats());
          test.equal(true, true);
          test.done();
          clearInterval(iA);
          clearInterval(iB);
          clearInterval(iC);
        }
        else{
          console.log(pulse, "lag is", obj[pulse].lag(), "missedBeats:", obj[pulse].missedBeats());
        }
      }
  }, 500);
};


exports.addEvent = function(test){

  test.expect(3);

  var presentInit = heartbeats.heart("globalBeat").present;

  heartbeats.heart("globalBeat").onBeat(3, function(present){
    console.log("onBeat 3", present-presentInit);
    test.equal(true, true);    
  });


  heartbeats.heart("globalBeat").onBeat(7, function(present){
    console.log("onBeat 7", present-presentInit);
    test.equal(true, true);    
    test.done();
  });  
};

exports.removeEvents = function(test){

  test.expect(1);

  heartbeats.heart("globalBeat").clearEvents();

  test.equal(heartbeats.heart("globalBeat").events.length, 0);    
  test.done();
};

exports.removeHeart = function(test){

  test.expect(1);

  heartbeats.destroyHeart("globalBeat");
  test.equal((heartbeats.heart("globalBeat") === undefined), true);
  test.done();
};

exports.tearDown = function(done){
  done();
};
