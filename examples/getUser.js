var Speakerdeck = require('../dist/speakerdeck');


var speakerdeck = new Speakerdeck();

speakerdeck.getUser('paulohp', function(err, data){
  if(!err)
    console.log(data);
});
