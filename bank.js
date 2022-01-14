const fs = require("fs");

const getData = () => {
  try {
    const dataBuffer = fs.readFileSync("bank.json");
    const dataJson = dataBuffer.toString();
    return JSON.parse(dataJson);
  } catch (err) {
    return [];
  }
};

const saveData = (data) => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync("bank.json", dataJson);
};

const findUser = (id) => {
  const data = getData();
  return data.findIndex((user) => user.id === id);
};

const updateUser = (index, prop, value) => {
  const data = getData();
  const newData = data.filter((user, i) => {
    if (i !== index) return user;
    else
      return {
        id: user.id,
        name: prop === "name" ? value : user.name,
        cash: prop === "cash" ? value : user.cash,
        credit: prop === "credit" ? value : user.credit,
      };
  });
  return newData;
};

const addUser = (user) => {
  const data = getData();
  const newUser = {
    id: user.id,
    name: user.name,
    cash: user.cash ? user.cash : 0,
    credit: user.credit ? user.credit : 0,
  };
  saveData([...data, newUser]);
  return newUser;
};

const deposit = (id, amount) => {
  const index = findUser(id);
  if (index === -1) {
    return {
      status: 400,
      msg: "User not found",
    };
  } else {
    const data = getData();
    const usersUpdated = updateUser(index, "cash", amount);
    saveData(usersUpdated);
  }
};

module.exports = { addUser, deposit };
