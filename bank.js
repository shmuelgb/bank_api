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
      const balance = data[index].cash + data[index].credit;
      if (balance + value < 0)
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
      break;

    case "credit":
      data[index].credit = value;
      response = {
        status: 200,
        msg: data[index],
      };
      break;
  }
  saveData(data);
  return response;
};

const addUser = ({ id, name, cash, credit }) => {
  const data = getData();
  const checkForDuplicates = findUser(id);
  if (checkForDuplicates > -1)
    return {
      status: 400,
      msg: "User already registered!",
    };
  else {
    const newUser = {
      id,
      name,
      cash: cash ? cash : 0,
      credit: credit ? credit : 0,
    };
    saveData([...data, newUser]);
    return {
      status: 200,
      msg: newUser,
    };
  }
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

const updateCredit = (id, amount) => {
  const index = findUser(id);
  if (index === -1) {
    return {
      status: 400,
      msg: "User not found",
    };
  } else return updateUser(index, "credit", amount);
};

const transfer = (idFrom, idTo, amount) => {
  const indexFrom = findUser(idFrom);
  const indexTo = findUser(idTo);
  if (indexFrom === -1 || indexTo === -1)
    return {
      status: 400,
      msg: "User not found",
    };
  else
    return {
      from: updateUser(indexFrom, "cash", -amount),
      to: updateUser(indexTo, "cash", amount),
    };
};

const getUserDetails = (id) => {
  const index = findUser(id);
  const data = getData();
  return {
    status: 200,
    msg: data[index],
  };
};

module.exports = {
  getData,
  addUser,
  deposit,
  withdraw,
  updateCredit,
  transfer,
  getUserDetails,
};
