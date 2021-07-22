# VylBot Core

Discord bot client based upon Discord.js 

## Installation

Download the latest version from the [releases page](https://gitlab.vylpes.com/Vylpes/vylbot-core/-/releases).

Copy the config template file and fill in the values.

```env
BOT_TOKEN={TOKEN}
BOT_PREFIX=v!

FOLDERS_COMMANDS=commands
FOLDERS_EVENTS=events
```

* **BOT_TOKEN:** Your bot's token, replace {TOKEN} with your bot token
* **BOT_PREFIX** The command prefix
* **FOLDERS_COMMANDS:** The folder which contains your commands
* **FOLDERS_EVENTS** The folder which contains your events 

Make sure that you **DO NOT** put your .env file into VCS!

## Usage

Implement the client using something like:

```ts
// bot.ts

import { CoreClient } from "vylbot-core";

const client = new CoreClient();
client.start();
```

### Writing Commands

The code below will reply to the user with 'PONG' when they type {PREFIX}ping

```ts
// Ping.ts

import { Command, ICommandContext } from "vylbot-core";

export class Ping extends Command {
	constructor() {
		super();
		this._roles = [ "Moderator" ];
		this._category = "General";
	}
	
	public override execute(context: ICommandContext) {
		context.message.reply('PONG');
	}
}
```

* **roles**: An array containing what roles the user needs in order to run the command.
* **category**: The category the role is part of, useful for categorising commands together in a help command.

The `context` parameter contains the following:
* **name**: The command name
* **args**: An array of arguments supplied with the command
* **message**: The Discord Message object for the command message sent

### Writing Events

The code below will log to the console 'Member Joined: {USERNAME}' when a member joins a server the bot is in

```ts
// Moderation.ts

import { Event } from "vylbot-core";
import { GuildMember } from "discord.js";

export class Moderation extends Event {
	public override guildMemberAdd(member: GuildMember) {
		console.log(`Member Joined: ${member.tag}`);
	}
}
```

The following events are supported:
* channelCreate(channel: Channel)
* channelDelete(channel: Channel | PartialDMChannel)
* channelUpdate(oldChannel: Channel, newChannel: Channel)
* guildBanAdd(guild: Guild, user: User)
* guildBanRemove(guild: Guild, user: User)
* guildCreate(guild: Guild)
* guildMemberAdd(member: GuildMember)
* guildMemberRemove(member: GuildMember | PartialGuildMember)
* guildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember)
* message(message: Message)
* messageDelete(message: Message | PartialMessage)
* messageUpdate(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage)
* ready()

All parameters are supplied from discord.js

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

We will not merge pull requests unless all checks pass and at least one of the repo members approves it.

See CONTRIBUTING.md for more details.
