const main = require("../amongus.js");

module.exports.name = "play";
module.exports.run = async (client, message, args) => {
  if (message.channel.type === "text") {
    main.sendConfigMessage(message.guild.id, message.channel.id);
    message.delete();
  } else {
    message.author.send("Command not available in DMs!");
  }
};
