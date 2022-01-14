const bank = require("./bank.js");
const express = require("express");
const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
  const user = {
    id: req.body.id,
    name: req.body.name,
    cash: req.body.cash,
    credit: req.body.credit,
  };
  const userAdded = bank.addUser(user);

  console.log(userAdded);
  res.send(userAdded);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
