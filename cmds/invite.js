const database = require("../lib/database.js");
const Discord = require("discord.js");

module.exports.name = "invite";
module.exports.run = async (client, message, args) => {
  if (message.channel.type === "text") {
    var embedMessageId = database.getMessage(message.guild.id);
    var channelId = database.getChannel(message.guild.id);

    var code;

    var oldEmbed = await client.channels
      .get(channelId)
      .fetchMessage(embedMessageId);

    if (oldEmbed == null) return;

    code = getCode(args[0], message);
    if (code != null) {
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
            name: "Invite code",
            value: code,
          },
        ],
        footer: {
          text: `Use ${client.prefix}help for bot help`,
        },
      });
      oldEmbed.edit(newEmbed);
    }
  } else {
    message.author.send("Command not available in DMs!");
  }
  message.delete();
};

function getCode(code, message) {
  var letters = /^[A-Za-z]+$/;
  if (code == null || code.length != 6 || !code.match(letters)) {
    message.author.send(
      `Invalid invite code: \`${code}\`!  Code must be 6 letters.`
    );
    return null;
  } else {
    if (code.match(letters)) {
      code = code.toUpperCase();
      return code;
    }
  }
}
