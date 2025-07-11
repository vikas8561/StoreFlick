require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const connectToDB = require('./configs/db.config');
const UserRouter = require('./routes/user.route');
const CartRouter = require('./routes/cart');

const app = express();

const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://store-flick.vercel.app',
    'https://store-flick-6qkr.vercel.app'
  ],
  credentials: true,
}));


app.use(express.json()); // allows us to parse icoming request from req.body
app.use(cookieParser());
app.use('/user', UserRouter);
app.use("/api/cart", CartRouter);

app.listen(process.env.PORT, () => {
    connectToDB();
    console.log('Server started on the prot', process.env.PORT);
});