require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const connectToDB = require('./configs/db.config');
const UserRouter = require('./routes/user.route');
const CartRouter = require('./routes/cart');
const WishlistRouter = require('./routes/wishlist');

const app = express();

const cors = require('cors');

app.use(cors());


app.use(express.json()); // allows us to parse icoming request from req.body
app.use(cookieParser());
app.use('/user', UserRouter);
app.use("/api/cart", CartRouter);
app.use("/api/wishlist", WishlistRouter);

app.listen(process.env.PORT, () => {
    connectToDB();
    console.log('Server started on the prot', process.env.PORT);
});
