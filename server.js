const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views','views')


const jwtAuth = require('./middleware/adminJwt')
app.use(jwtAuth.authJwt)

const adminRouter = require("./routes/admin.routes");
app.use(adminRouter);

const dbDriver =

"mongodb+srv://Kamalesh9832:Kamal1995@cluster0.r2lbcdv.mongodb.net/AdminREG"

const port = process.env.PORT || 2025;

mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(port, () => {
      console.log(`Db is connected`);
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
