# Speakerdeck API

### How to install
`npm install speakerdeck`

### How to use

```javascript
var Speakerdeck = require('speakerdeck');

var speakerdeck = new Speakerdeck({});

speakerdeck.getUser('paulohp', function(err, data){
  if(!err)
    console.log(data);
});
```
