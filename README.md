# Among Us Discord Helper Bot
## About
Don't you hate it when someone has a different name in Among Us than they do on Discord?
Well this is a Discord bot that makes it easier to tell who is who. Each player picks the color that they are using in\-game and the color will be added to the beginning of their username \(\[Blue\] Username\). When the user deselects a color, their username is reverted back to the way it was.

[Add the bot to your server!](http://amongus.flyerzrule.com)

![Bot Example](/images/bot_example.png)

## Initial Setup
### Installing packages
Run the command "npm install" in the root of the project to install all of the required packages. If you run into issues installing enmap, following the installation instructions found [here](https://enmap.evie.dev/install).
### Setting up Discord emojis
The pictures located in the [emojis directory](https://github.com/strenkml/among-us-bot/tree/master/emojis) need to be emojis on a Discord Server that the bot is apart of. The emoji names should be the same as the name of the file, for example Red.png would be "Red".
### Setting up bot tokens
The config\/example\_tokens.json file needs to be renamed to tokens.json. In the file, there are spots for two different bot tokens. One is for production and one is for testing. You can leave the test token empty if you don't want to use the test mode functionality. Information about creating a Discord bot and retrieving its token can be found [here](https://www.writebots.com/discord-bot-token/).
### Setting up permissions
The bot needs a role that has the following permissions:
* Manage Nicknames \(So that it can change the nicknames of the users\)
* Manage Messages \(So that it can delete the old color selection message when a new one is made\)
* Use External emojis \(So that it can use the color emojis if the bot is being used in a different server than where the emojis are kept\)
* Add Reactions \(So that it can add reactions to the message\)
The bot will also need to be able to read and send messages in the channels that you want the bot to be able to function. The bot's role should be the highest role in the role list, this is because the bot cannot change the nickname of a user that has a role above it.

## Configuration
The parameters mentioned below are keys in the config\/config.json file.
### testMode
This setting controls whether or not the bot is in test mode. If set to true, the bot will use the test prefix and the test token \(found in the tokens.json file\). If set to false, the bot will use the production prefix and the production token \(found in the tokens.json file\).
### dataStoreName
This is the name of the database that information will be stored to
### prodPrefix
This is the commmand prefix that is used when the bot is in production mode.
### testPrefix
This is the commmand prefix that is used when the bot is in test mode.
### templates
The contents of this key should not be modified, they are used when adding info to the database.

## Running the bot
Below are the two ways that the bot can be run:
1. Using node
   * Run the command "node amongus.js" to run the bot
2. Using nodemon. Nodemon is a npm package that restarts the project when code changes have been detected. The nodemon.json file includes files that should not cause the project to restart.
   * Run the command "npm install \-g nodemon" to install the package globally
   * Run the command "nodemon amongus.js" to run the bot

## Using the bot
\{prefix\} refers to the configured prefix from the config\/config.json file
### \{prefix\}play
Sends the color selection message to the channel where the command is used. The bot will react to the message with all of the emojis. When a user clicks on one of the reactions the chosen color will be added to the beginning of their username \(\[Color\] username\).
### \{prefix\}reset
Removes the color from the beginning of all of the user's usernames and removes the reactions from the message.
### \{prefix\}info
Send a message to the channel containing information about the Bot author and ways to contact them about bugs.

## Notes
1. The bot cannot change the nickname of the server owner. This is a limitation of the Discord API. The server owner will will have to change their name manually.
