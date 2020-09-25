const Discord = require("discord.js");
const { get } = require("http");

const client = new Discord.Client();
const config = require("./config.json");

const serverInfo = require("./helpers/serverInfo.js");

var token;
var prefix;

const resetEmoji = "🔄";

const blankfield = "\u200B";

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
  token = config.testToken;
  prefix = config.testPrefix;
} else {
  token = config.prodToken;
  prefix = config.prodPrefix;
}

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

client.on("ready", () => {
  console.log("Bot is ready!");
  client.user.setActivity(`${prefix}play`, { type: "WATCHING" });
  reset(true);
});

client.on("message", (msg) => {
  if (!msg.author.bot) {
    if (!msg.content.startsWith(prefix)) {
      return;
    }

    if (msg.content.startsWith(prefix + "play")) {
      sendConfigMessage(msg.guild.id, msg.channel.id);
    } else if (msg.content.startsWith(prefix + "wipe")) {
      serverInfo.deleteAll();
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  var guild = reaction.message.guild.id;
  if (!user.bot) {
    if (serverInfo.getMessage(guild) == reaction.message.id) {
      // If reaction is one of the colors
      if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
        if (!serverInfo.isUser(guild, user.id)) {
          serverInfo.addUser(
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
      } else if (reaction.emoji.name === resetEmoji) {
        reset(false, reaction);
        reaction.remove(user);
      }
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  var guild = reaction.message.guild.id;
  if (!user.bot) {
    if (serverInfo.getMessage(guild) == reaction.message.id) {
      if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
        if (serverInfo.isUser(guild, user.id)) {
          if (serverInfo.getUserColor(guild, user.id) == reaction.emoji.name) {
            reaction.message.guild
              .member(user)
              .setNickname(
                serverInfo.getUserOldNick(guild, user.id),
                "Removing Among Us Color"
              );
            serverInfo.deleteUser(guild, user.id);
          }
        }
      }
    }
  }
});

async function sendConfigMessage(guild, channel) {
  if (!serverInfo.isGuild(guild)) {
    serverInfo.addGuild(guild);
  } else {
    reset(true);
  }
  if (serverInfo.getMessage(guild) != null) {
    let oldMessage = await client.channels
      .get(channel)
      .fetchMessage(serverInfo.getMessage(guild));
    oldMessage.delete();
  }
  serverInfo.setChannel(guild, channel);
  var embed = new Discord.RichEmbed({
    title: "Among Us Helper",
    description: "Helps you know which player is talking!",
    fields: [
      {
        name: "Player color",
        value: "Pick one of the reactions below based on your in-game color.",
      },
      {
        name: "Reset",
        value:
          "Click :arrows_counterclockwise: to remove all of the nicknames and to reset the reactions.",
      },
    ],
    timestamp: new Date(),
  });
  var embedMessage = await client.channels.get(channel).send(embed);
  serverInfo.setMessage(embedMessage.guild.id, embedMessage.id);

  emojis.forEach((emojiName) => {
    embedMessage.react(client.emojis.find((emoji) => emoji.name === emojiName));
  });
  embedMessage.react(resetEmoji);
}

async function reset(init, msgReaction) {
  if (init) {
    var keys = serverInfo.getKeys();
    keys.forEach((key) => {
      var users = serverInfo.getUsers(key);
      for (const user in users) {
        if (user != "default") {
          client.guilds
            .get(key)
            .member(user)
            .setNickname(
              serverInfo.getUserOldNick(key, user),
              "Removing Among Us Color"
            );
          serverInfo.deleteUser(key, user);
        }
      }
      // Delete the old message
      client.channels
        .get(serverInfo.getChannel(key))
        .fetchMessage(serverInfo.getMessage(key)).delete;
    });
  } else {
    var reactions = msgReaction.message.reactions;
    reactions.forEach(async (reaction) => {
      var users = await reaction.fetchUsers();
      users = users.array();
      users.forEach((user) => {
        if (!user.bot) {
          reaction.remove(user);
        }
      });
    });
  }
}

client.login(token);
