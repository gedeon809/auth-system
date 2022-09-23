// mongoose
require('./config/db');

const app = require('express')();
const bodyParser = require('express').json;
app.use(bodyParser());

const cors = require('cors');
app.use(cors());

const UserRouter = require('./api/User');

// create port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on localhost:${port}`);
});

// route
app.use('/user', UserRouter);
