const config = require("../config/config.json");
const Enmap = require("enmap");
const store = new Enmap({ name: config.dataStoreName });

// Getters
module.exports.getGuild = (guild) => {
  if (this.isGuild(guild)) {
    return store.get(`${guild}`);
  } else {
    return null;
  }
};

module.exports.getMessage = (guild) => {
  if (this.isGuild(guild)) {
    return store.get(`${guild}`, "message");
  } else {
    return null;
  }
};

module.exports.getChannel = (guild) => {
  if (this.isGuild(guild)) {
    return store.get(`${guild}`, "channel");
  } else {
    return null;
  }
};

module.exports.getUser = (guild, user) => {
  if (this.isGuild(guild) && this.isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}`);
  } else {
    return null;
  }
};

module.exports.getUsers = (guild) => {
  if (this.isGuild(guild)) {
    return store.get(`${guild}`, "users");
  } else {
    return null;
  }
};

module.exports.getUserOldNick = (guild, user) => {
  if (this.isGuild(guild) && this.isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}.oldNick`);
  } else {
    return null;
  }
};

module.exports.getUserColor = (guild, user) => {
  if (this.isGuild(guild) && this.isUser(guild, user)) {
    return store.get(`${guild}`, `users.${user}.color`);
  } else {
    return null;
  }
};

module.exports.getKeys = () => {
  return store.indexes;
};

// Setters
module.exports.addGuild = (guild) => {
  if (!this.isGuild(guild)) {
    store.set(`${guild}`, config.templates.serverInfo);
  }
};

module.exports.setMessage = (guild, message) => {
  if (this.isGuild(guild)) {
    store.set(`${guild}`, message, "message");
  }
};

module.exports.setChannel = (guild, channel) => {
  if (this.isGuild(guild)) {
    store.set(`${guild}`, channel, "channel");
  }
};

module.exports.addUser = (guild, user, oldNick, color) => {
  if (this.isGuild(guild)) {
    var newUser = config.templates.user;
    newUser.oldNick = oldNick;
    newUser.color = color;
    store.set(`${guild}`, newUser, `users.${user}`);
  }
};

module.exports.setUserOldNick = (guild, user, oldNick) => {
  if (this.isGuild(guild) && this.isUser(guild, user)) {
    store.set(`${guild}`, oldNick, `users.${user}.oldNick`);
  }
};

module.exports.setUserColor = (guild, user, color) => {
  if (this.isGuild(guild) && this.isUser(guild, user)) {
    store.set(`${guild}`, color, `users.${user}.color`);
  }
};

// Check Exists
module.exports.isGuild = (guild) => {
  return store.has(guild);
};

module.exports.isUser = (guild, user) => {
  return store.has(`${guild}`, `users.${user}`);
};

// Deleters
module.exports.deleteGuild = (guild) => {
  store.delete(`${guild}`);
};

module.exports.deleteUser = (guild, user) => {
  store.delete(`${guild}`, `users.${user}`);
};

module.exports.deleteAll = () => {
  store.deleteAll();
};
