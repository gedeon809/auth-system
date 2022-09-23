require('dotenv').config();
const mongoose = require('mongoose');

//create connection with db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB connected first connection');
  })
  .catch((err) => {
    throw err;
  });
