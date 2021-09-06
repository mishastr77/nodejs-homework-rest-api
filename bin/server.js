const app = require("../app");
const db = require("../models/db");
require("dotenv").config();

const { PORT = 3000 } = process.env;
db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((e) => {
  console.log(`Errore: ${e.message}`);
});
