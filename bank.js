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
  let response;
  switch (prop) {
    case "name":
      data[index] = value;
      break;

    case "cash":
      if (data[index].cash + value < 0)
        response = {
          status: 400,
          msg: "not enough credit!",
        };
      else {
        data[index].cash += value;
        response = {
          status: 200,
          msg: data[index],
        };
      }
      saveData(data);
      return response;
  }
  return data;
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
  } else return updateUser(index, "cash", amount);
};

const withdraw = (id, amount) => {
  const index = findUser(id);
  if (index === -1) {
    return {
      status: 400,
      msg: "User not found",
    };
  } else return updateUser(index, "cash", -amount);
};

module.exports = { addUser, deposit, withdraw };
