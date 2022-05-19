const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social_network')
  .then(db => console.log('Db connected successfully'))
  .catch(error => console.log(error));