const database = require("../lib/database.js");
const Discord = require("discord.js");

module.exports.name = "invite";
module.exports.run = async (client, message, args) => {
  if (message.channel.type === "text") {
    var embedMessageId = database.getMessage(message.guild.id);
    var channelId = database.getChannel(message.guild.id);

    var code;
    var region;

    var oldEmbed = await client.channels
      .get(channelId)
      .fetchMessage(embedMessageId);

    if (oldEmbed == null) return;

    code = getCode(args[0], message);
    if (code != null) {
      if (args[1] == null) {
        region = "North America";
      } else {
        region = args[1];
      }
      var newEmbed = new Discord.RichEmbed({
        title: "Color Assignment",
        description: "Helps you know which player is talking!",
        fields: [
          {
            name: "Player color",
            value:
              "Pick one of the reactions below based on your in-game color.",
          },
          {
            name: "Invite code and region",
            value: `**Code:** ${code}\n**Region:** ${region}`,
          },
        ],
        footer: {
          text: `Use ${client.prefix}help for bot help`,
        },
      });
      oldEmbed.edit(newEmbed);
      message.delete();
    }
  } else {
    message.author.send("Command not available in DMs!");
  }
};

function getCode(code, message) {
  if (code == null || code.length != 6) {
    message.author.send("Invalid invite code!  Code must be 6 characters.");
    message.delete();
    return null;
  } else {
    code = code.toUpperCase();
    return code;
  }
}
