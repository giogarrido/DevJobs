const mongoose = require("mongoose");
require('./config/db');

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");


require("dotenv").config({ path: "variables.env" });

const app = express();

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar Handlebars como template engine
app.engine("handlebars", exphbs.engine({
    defaultLayout: "layout",
    helpers: require("./helpers/handlebars")

}));
app.set("view engine", "handlebars");

// stastic files
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO, 
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.DATABASE})
}));

app.use("/", router());

app.listen(process.env.PUERTO);
