const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 8080;
const app = express();
const pool = require("./db");

app.use(express.json());

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/user", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    const user = response.data.results[0];

    const userData = {
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

    const fields = Object.keys(userData).join(",");
    const values = Object.values(userData);

    await pool.query(
      `INSERT INTO users (${fields}) VALUES (${values
        .map((_, i) => `$${i + 1}`)
        .join(",")})`,
      values
    );

    res.send("The new user has been successfully added to the database!");
  } catch (err) {
    console.error(err);
    res.status(400).send(`"Error while adding user"! >>> ERR: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on the port ${PORT}`);
});
