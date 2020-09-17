const config = require("../config.json");
const Enmap = require("enmap");
const store = new Enmap({ name: config.dataStoreName });

// Getters
function getGuild(guild) {
  if (isGuild(guild)) {
    return store.get(`${guild}`);
  } else {
    return null;
  }
}

function getMessage(guild) {
  if (isGuild(guild)) {
    return store.get(`${guild}`, "message");
  } else {
    return null;
  }
}

function getChannel(guild) {
  if (isGuild(guild)) {
    return store.get(`${guild}`, "channel");
  } else {
    return null;
  }
}

function getUser(guild, user) {
  if (isGuild(guild) && isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}`);
  } else {
    return null;
  }
}

function getUsers(guild) {
  if (isGuild(guild)) {
    return store.get(`${guild}`, "users");
  } else {
    return null;
  }
}

function getUserOldNick(guild, user) {
  if (isGuild(guild) && isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}.oldNick`);
  } else {
    return null;
  }
}

function getUserColor(guild, user) {
  if (isGuild(guild) && isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}.color`);
  } else {
    return null;
  }
}

function getKeys() {
  return store.indexes;
}

// Setters
function addGuild(guild) {
  if (!isGuild(guild)) {
    store.set(`${guild}`, config.templates.serverInfo);
  }
}

function setMessage(guild, message) {
  if (isGuild(guild)) {
    store.set(`${guild}`, message, "message");
  }
}

function setChannel(guild, channel) {
  if (isGuild(guild)) {
    store.set(`${guild}`, channel, "channel");
  }
}

function addUser(guild, user, oldNick, color) {
  if (isGuild(guild)) {
    var newUser = config.templates.user;
    newUser.oldNick = oldNick;
    newUser.color = color;
    store.set(`${guild}`, newUser, `users.${user}`);
  }
}

function setUserOldNick(guild, user, oldNick) {
  if (isGuild(guild) && isUser(guild, user)) {
    store.set(`${guild}`, oldNick, `users.${user}.oldNick`);
  }
}

function setUserColor(guild, user, color) {
  if (isGuild(guild) && isUser(guild, user)) {
    store.set(`${guild}`, color, `users.${user}.color`);
  }
}

// Check Exists
function isGuild(guild) {
  return store.has(guild);
}

function isUser(guild, user) {
  return store.has(`${guild}`, `users.${user}`);
}

// Deleters
function deleteGuild(guild) {
  store.delete(`${guild}`);
}

function deleteUser(guild, user) {
  store.delete(`${guild}`, `users.${user}`);
}

function deleteAll() {
  store.deleteAll();
}

module.exports.getChannel = getChannel;
module.exports.getMessage = getMessage;
module.exports.getGuild = getGuild;
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.getUserOldNick = getUserOldNick;
module.exports.getUserColor = getUserColor;
module.exports.getKeys = getKeys;

module.exports.addUser = addUser;
module.exports.addGuild = addGuild;
module.exports.setMessage = setMessage;
module.exports.setChannel = setChannel;
module.exports.setUserOldNick = setUserOldNick;
module.exports.setUserColor = setUserColor;

module.exports.isGuild = isGuild;
module.exports.isUser = isUser;

module.exports.deleteGuild = deleteGuild;
module.exports.deleteUser = deleteUser;
module.exports.deleteAll = deleteAll;
