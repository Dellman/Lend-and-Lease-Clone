var siege = require('siege');
siege()
  .on(3000)
  .for(300).times
  .post('/login', {email: 'edvin.wahlberg@gmail.com', password: 'password'})
  .attack()
