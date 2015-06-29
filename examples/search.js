var Speakerdeck = require('../dist/speakerdeck');


var speakerdeck = new Speakerdeck();

speakerdeck.search({q: 'Node.js', page:1}, function(err, data){
  if(!err)
    console.log(data);
});
