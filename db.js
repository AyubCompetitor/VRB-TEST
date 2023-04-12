// данные базы намеренно не скрыты, так как база является одноразовой для проекта и не имеет никакой ценности :)
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "mpoowpeu",
  password: "LwpnQvrCsLIkj5qEGKNURq17uGQ-TAia",
  host: "snuffleupagus.db.elephantsql.com",
  port: 5432,
  database: "mpoowpeu",
});

module.exports = pool;
