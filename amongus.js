const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

const config = require("./config/config.json");
const tokens = require("./config/tokens.json");

const database = require("./lib/database.js");

client.commands = new Discord.Collection();

var token;
var prefix;

const emojis = [
  "Black",
  "Blue",
  "Brown",
  "Cyan",
  "Green",
  "Lime",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "White",
  "Yellow",
];

if (config.testMode) {
  token = tokens.test;
  prefix = config.testPrefix;
} else {
  token = tokens.prod;
  prefix = config.prodPrefix;
}
client.prefix = prefix;

// Setup handlers for process events
process.on("unhandledRejection", function (err, p) {
  console.error("Unhandled Rejection");
  console.error(err);
  console.error(p);
});

process.on("warning", (warning) => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});

client.on("error", console.error);

// Load the commands from the cmd directory
fs.readdir("./cmds/", (err, files) => {
  if (err) console.error(err);
  let jsFiles = files.filter((f) => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) {
    console.log("No commands to load!");
    return;
  }

  console.log(`Loading ${jsFiles.length} commands!`);

  jsFiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    client.commands.set(props.name, props);
  });
});

client.on("ready", () => {
  console.log("Bot is ready!");
  client.user.setActivity(`${client.guilds.array().length} guilds`, {
    type: "WATCHING",
  });
  this.reset(true);
});

client.on("message", (message) => {
  if (message.author.bot) return; // Ignores all bots
  if (message.isMemberMentioned(client.user) && !message.mentions.everyone) {
    message.channel.send(`My prefix is: \`${prefix}\``);
    return;
  }
  if (!message.content.startsWith(prefix)) return; // Ignores all messages that don't start with the prefix

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  let cmd = client.commands.get(command.slice(prefix.length));
  try {
    if (cmd) cmd.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  var guild = reaction.message.guild.id;
  if (!user.bot) {
    if (database.getMessage(guild) == reaction.message.id) {
      // If reaction is one of the colors
      if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
        if (!database.isUser(guild, user.id)) {
          database.addUser(
            guild,
            user.id,
            reaction.message.guild.member(user).displayName,
            reaction.emoji.name
          );
          let newUsername = `[${reaction.emoji.name}] ${
            reaction.message.guild.member(user).displayName
          }`;
          reaction.message.guild
            .member(user)
            .setNickname(newUsername, "Among Us Color")
            .catch((reason) => {
              user.send(
                `**Permission Missing!**\n__If you're the server owner__\nI can't set the nickname to \`${newUsername}\`, so you will have to it manually.\n__If you're not the server owner__\nMake sure that my role is at the top of the role hierarchy.`
              );
              reaction.remove(user);
            });
        } else {
          reaction.remove(user);
        }
      }
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  var guild = reaction.message.guild.id;
  if (!user.bot) {
    if (database.getMessage(guild) == reaction.message.id) {
      if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
        if (database.isUser(guild, user.id)) {
          if (database.getUserColor(guild, user.id) == reaction.emoji.name) {
            reaction.message.guild
              .member(user)
              .setNickname(
                database.getUserOldNick(guild, user.id),
                "Removing Among Us Color"
              );
            database.deleteUser(guild, user.id);
          }
        }
      }
    }
  }
});

module.exports.sendConfigMessage = async (guild, channel) => {
  if (!database.isGuild(guild)) {
    database.addGuild(guild);
  } else {
    this.reset(true);
  }
  if (database.getMessage(guild) != null) {
    let oldMessage = await client.channels
      .get(channel)
      .fetchMessage(database.getMessage(guild));
    oldMessage.delete();
  }
  database.setChannel(guild, channel);
  var embed = new Discord.RichEmbed({
    title: "Color Assignment",
    description: "Helps you know which player is talking!",
    fields: [
      {
        name: "Player color",
        value: "Pick one of the reactions below based on your in-game color.",
      },
    ],
    footer: {
      text: `Use ${prefix}help for bot help`,
    },
  });
  var embedMessage = await client.channels.get(channel).send(embed);
  database.setMessage(embedMessage.guild.id, embedMessage.id);

  emojis.forEach((emojiName) => {
    embedMessage.react(client.emojis.find((emoji) => emoji.name === emojiName));
  });
};

module.exports.reset = async (init, guild) => {
  if (init) {
    var keys = database.getKeys();
    keys.forEach((key) => {
      var users = database.getUsers(key);
      for (const user in users) {
        if (user != "default") {
          client.guilds
            .get(key)
            .member(user)
            .setNickname(
              database.getUserOldNick(key, user),
              "Removing Among Us Color"
            );
          database.deleteUser(key, user);
        }
      }
      // Delete the old message
      client.channels
        .get(database.getChannel(key))
        .fetchMessage(database.getMessage(key)).delete;
    });
  } else {
    var channel = client.channels.get(database.getChannel(guild));
    channel.startTyping();
    var message = await channel.fetchMessage(database.getMessage(guild));
    var reactions = message.reactions;
    reactions.forEach(async (reaction) => {
      var users = await reaction.fetchUsers();
      users = users.array();
      users.forEach((user) => {
        if (!user.bot) {
          reaction.remove(user);
        }
      });
    });
    channel.stopTyping(true);
  }
};

client.login(token);
