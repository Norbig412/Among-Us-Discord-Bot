const main = require("../amongus.js");

module.exports.name = "reset";
module.exports.run = async (client, message, args) => {
  if (message.channel.type === "text") {
    main.reset(false, message.guild.id);
    message.delete();
  } else {
    message.author.send("Command not available in DMs!");
  }
};
