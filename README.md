# Speakerdeck API
## Unofficial API for Speakerdeck

## How to install
`npm install speakerdeck`

## How to use

```
var Speakerdeck = require('speakerdeck');

speakerdeck = new Speakerdeck({});

speakerdeck.getUser('paulohp', function(err, data){
  if(!err)
    console.log(data);
});
```
