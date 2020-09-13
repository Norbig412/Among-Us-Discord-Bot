const { randomBytes } = require("crypto");
const Discord = require("discord.js");

const client = new Discord.Client();
const config = require("./config.json");

const store = require("data-store")({ path: config.dataStoreName });

var token;
var channel;

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
  channel = config.testChannel;
} else {
  token = config.prodToken;
  channel = config.prodChannel;
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
  reset(true);
  sendConfigMessage();
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (!user.bot) {
    // If reaction is one of the colors
    if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
      if (!store.has(user.id)) {
        let userObj = {
          oldNick: reaction.message.member.nickname || user.username,
          color: reaction.emoji.name,
        };
        store.set(user.id, userObj);
        let newUsername = `[${reaction.emoji.name}] ${
          store.get(user.id).oldNick
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
      reset(false);
      reaction.remove(user);
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (!user.bot) {
    if (emojis.some((emoji) => emoji == reaction.emoji.name)) {
      if (store.has(user.id)) {
        if (store.get(user.id).color == reaction.emoji.name) {
          reaction.message.guild
            .member(user)
            .setNickname(store.get(user.id).oldNick, "Removing Among Us Color");
          store.del(user.id);
        }
      }
    }
  }
});

async function reset(onStart) {
  var json = store.json(null);
  var obj = JSON.parse(json);
  // console.log(obj);
  for (const property in obj) {
    let member = await client.channels.get(channel).guild.fetchMember(property);
    member.setNickname(obj[property].oldNick);
    if (onStart) {
      store.del(property);
    }
  }
  if (!onStart) {
    var reactions = embedMessage.reactions.array();
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

var embedMessage;
async function sendConfigMessage() {
  var embed = new Discord.RichEmbed({
    title: "Among Us Helper",
    description: "Helps you know which playing is talking!",
    fields: [
      {
        name: "Player color",
        value: "Pick one of the reactions below based on your ingame color.",
      },
      {
        name: "Reset",
        value:
          "Click :arrows_counterclockwise: to remove all of the nicknames and to reset the reactions.",
      },
    ],
    timestamp: new Date(),
  });
  embedMessage = await client.channels.get(channel).send(embed);

  emojis.forEach((emojiName) => {
    embedMessage.react(client.emojis.find((emoji) => emoji.name === emojiName));
  });
  embedMessage.react(resetEmoji);
}

client.login(token);
