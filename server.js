const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 8080;
const app = express();
const pool = require("./db");

app.use(express.json());

app.use(cors());

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/user", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    const user = response.data.results[0];
    const id = uuidv4();

    const userData = {
      id: id,
      gender: user.gender,
      first_name: user.name.first,
      last_name: user.name.last,
      street_number: user.location.street.number,
      street_name: user.location.street.name,
      city: user.location.city,
      state: user.location.state,
      country: user.location.country,
      postcode: user.location.postcode,
      latitude: user.location.coordinates.latitude,
      longitude: user.location.coordinates.longitude,
    };

    await pool.query(
      `INSERT INTO users (id, gender, first_name, last_name, street_number, street_name, city, state, country, postcode, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
       Object.values(userData)
    );

    res.send("Новый пользователь успешно добавлен в базу данных!");
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(`Ошибка при добавлении пользователя! >>> ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
