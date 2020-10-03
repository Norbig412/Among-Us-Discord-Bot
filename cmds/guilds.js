module.exports.name = "guilds";
module.exports.run = async (client, message, args) => {
  var guilds = client.guilds;
  console.log("Start of guilds....");
  guilds.forEach((guild) => {
    console.log(guild.name);
  });
  console.log("...End of guilds");
};
