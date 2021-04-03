// Import required libraries.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config/config");
// Create server.
const app = express();

// Settings.
app.set("port", process.env.PORT || 4000);
app.set("key", config.key);

// Middleware.
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,"
  );
  res.header("content-type: application/json; charset=utf-8");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Routes.
app.use(require("./routes/routes.js"));

// Sockets.
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    credential: true,
  },
});

module.exports = app;
