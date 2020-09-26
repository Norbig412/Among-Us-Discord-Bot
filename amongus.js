const Discord = require("discord.js");

const client = new Discord.Client();
const config = require("./config.json");
const tokens = require("./tokens.json");

const database = require("./helpers/database.js");

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
    } else if (msg.content.startsWith(prefix + "info")) {
      var embed = new Discord.RichEmbed({
        title: "Bot Info",
        description: "Created by flyerzrule#0001",
        fields: [
          {
            name: "__**Report Bugs**__",
            value:
              "**Discord:** flyerzrule#0001\n**Reddit:** [flyerzrule](https://reddit.com/user/flyerzrule)",
          },
        ],
      });
      msg.channel.send(embed);
    } else if (msg.content.startsWith(prefix + "reset")) {
      reset(false, msg.guild.id);
      msg.delete();
    }
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

async function sendConfigMessage(guild, channel) {
  if (!database.isGuild(guild)) {
    database.addGuild(guild);
  } else {
    reset(true);
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
      {
        name: "Reset",
        value: `Use ${prefix}reset to reset all nicknames and reactions.`,
      },
    ],
    footer: {
      text: `Use ${prefix}info for info about reporting issues.`,
    },
  });
  var embedMessage = await client.channels.get(channel).send(embed);
  database.setMessage(embedMessage.guild.id, embedMessage.id);

  emojis.forEach((emojiName) => {
    embedMessage.react(client.emojis.find((emoji) => emoji.name === emojiName));
  });
}

async function reset(init, guild) {
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
    var message = await client.channels
      .get(database.getChannel(guild))
      .fetchMessage(database.getMessage(guild));
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
  }
}

client.login(token);
