// server.js

const express = require("express");
// server.js
require("dotenv").config();
console.log("API KEY:", process.env.WEATHER_API_KEY); // should not be undefined

const fs = require("fs");
const axios = require("axios");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/submit", (req, res) => {
  const city = req.body.city;

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    )
    .then((response) => {
      const weather = {
        type: response.data.weather[0].main,
        description: response.data.weather[0].description,
        temperature: response.data.main.temp,
        visibility: response.data.visibility,
        speed: response.data.wind.speed,
      };

      fs.readFile(
        path.join(__dirname, "/public/weather.html"),
        "utf-8",
        (err, htmlData) => {
          if (err) {
            return res.status(500).send("Error reading HTML file");
          }

          let finalHtml = htmlData
            .replace("{{{type}}}", weather.type)
            .replace("{{{description}}}", weather.description)
            .replace("{{{temperature}}}", weather.temperature)
            .replace("{{{visibility}}}", weather.visibility)
            .replace("{{{speed}}}", weather.speed);

          res.send(finalHtml);
        }
      );
    })
    .catch((error) => {
      console.log({ error });
      res.status(500).json({ error: error.message });
    });
});

app.listen(3001, () => {
  console.log("server running on 3001");
});
