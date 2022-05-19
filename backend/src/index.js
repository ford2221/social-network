const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
//importing database
require('./database');


//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


//importing routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//routes
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/posts', postRoute);


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})