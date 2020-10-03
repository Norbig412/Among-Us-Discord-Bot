const Discord = require("discord.js");

module.exports.name = "help";
module.exports.run = async (client, message, args) => {
  if (args.length == 0) {
    var embed = new Discord.RichEmbed({
      title: "Help",
      description: "Bot created by flyerzrule#0001",
      color: 0xff0000,
      fields: [
        {
          name: `__**List of Commands (Use \`${client.prefix}help COMMAND\` for more info**__`,
          value: `\`${client.prefix}hello\` - Available in DMs\n\`${client.prefix}help\` - Available in DMs\n\`${client.prefix}play\`\n\`${client.prefix}invite\`\n\`${client.prefix}reset\`\n`,
        },
        {
          name: "__**Report Bugs**__",
          value:
            "**Discord:** flyerzrule#0001\n**Reddit:** [flyerzrule](https://reddit.com/user/flyerzrule)",
        },
        {
          name: "__**Invite Link**__",
          value: "http://amongus.flyerzrule.com",
        },
      ],
    });
    message.author.send(embed);
  } else {
    var embed = new Discord.RichEmbed();
    embed.setColor(0xff0000);
    embed.setTitle(`Help: ${args[0]}`);
    switch (args[0]) {
      case "hello":
        embed.setDescription(
          "Helps to check if the bot is online and reponding"
        );
        break;
      case "help":
        embed.setDescription(
          "Prints basic bot info, bug reporting info, a list of available commands, and the bot invite link."
        );
        embed.addField("__**Usage**__", `\`${client.prefix}help COMMAND\``);
        embed.addField(
          "COMMAND",
          "This is an optional argument.  If given it will print more information about the given command.  Otherwise, it will print the normal help message."
        );
        break;
      case "play":
        embed.setDescription(
          "Sends the color selection messages to the channel where the command is sent. Below is an example of the message."
        );
        let attachmnent = new Discord.Attachment(
          "./images/bot_example.png",
          "bot_example.png"
        );
        embed.attachFile(attachmnent);
        embed.setImage("attachment://bot_example.png");
        embed.addField(
          "Usage",
          "Clicking on one of the color reactions adds the color to the beginning of the user's name."
        );
        break;
      case "invite":
        embed.setDescription(
          "Sets the invite code and region in the color selection message."
        );
        embed.addField(
          "__**Usage**__",
          `\`${client.prefix}invite CODE REGION\``
        );
        embed.addField(
          "CODE",
          "This is the 6 character invite code for the game lobby."
        );
        embed.addField(
          "REGION",
          "This is the region that the invite code belongs to. This argument is optional and will default to North American servers."
        );
        break;
      case "reset":
        embed.setDescription(
          "Resets all of the usernames and the reactions on the color selection message."
        );
        embed.addField(
          "Note",
          "This command can take some time depending on how reactions there are. The bot will be shown as typing while this command is running."
        );
        break;
      default:
        console.error("Unknown help command!");
    }
    message.author.send(embed);
  }
};
