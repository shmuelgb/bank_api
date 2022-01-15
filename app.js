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
  const addUserRes = bank.addUser(user);

  res.status(addUserRes.status).send(addUserRes.msg);
});

app.put("/users/:id", (req, res) => {
  switch (req.body.action) {
    case "deposit":
      const depositRes = bank.deposit(req.params.id, parseInt(req.body.amount));
      res.status(depositRes.status).send(depositRes.msg);
      break;

    case "withdraw":
      const withdrawRes = bank.withdraw(
        req.params.id,
        parseInt(req.body.amount)
      );
      res.status(withdrawRes.status).send(withdrawRes.msg);
      break;

    case "update credit":
      const updateCreditRes = bank.updateCredit(
        req.params.id,
        parseInt(req.body.amount)
      );
      res.status(updateCreditRes.status).send(updateCreditRes.msg);
      break;

    case "transfer":
      const transferRes = bank.transfer(
        req.params.id,
        req.body.to,
        parseInt(req.body.amount)
      );
      res.status(transferRes.from.status).send({
        from: transferRes.from.msg,
        to: transferRes.to.msg,
      });
      break;
  }
});

app.get("/users", (req, res) => {
  res.send(bank.getData());
});

app.get("/users/:id", (req, res) => {
  res.send(bank.getUserDetails(req.params.id).msg);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
