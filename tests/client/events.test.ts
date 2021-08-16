import { Events } from "../../src/client/events";

import { Message, Client, User, GuildMember, TextChannel, Guild, SnowflakeUtil, Role, DMChannel } from "discord.js";
import * as dotenv from "dotenv";
import { Util } from "../../src/client/util";

jest.mock("dotenv");
jest.mock("../../src/client/util");

test('OnMessage_GivenMessageIsValid_ExpectMessageSent', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockImplementation((name: string, args: string[], message: Message) => {
        return { 
            valid: true
        }
    });

    let discordClient = new Client();
    let guild = new Guild(discordClient, {
      id: SnowflakeUtil.generate(),
    });
    let user = new User(discordClient, {
      id: SnowflakeUtil.generate(),
    });
    let member = new GuildMember(
      discordClient,
      { id: SnowflakeUtil.generate(), user: { id: user.id } },
      guild
    );
    let role = new Role(
      discordClient,
      { id: SnowflakeUtil.generate() },
      guild
    );
    let message = new Message(
      discordClient,
      {
        content: "!test first",
        author: { username: "test-user", discriminator: 1234 },
        id: "test",
      },
      new TextChannel(guild, {
        client: discordClient,
        guild: guild,
        id: "channel-id",
      })
    );

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeTruthy();

    expect(result.context?.prefix).toBe('!');
    expect(result.context?.name).toBe('test');
    expect(result.context?.args.length).toBe(1);
    expect(result.context?.args[0]).toBe('first');
    expect(result.context?.message).toBe(message);

    discordClient.destroy();
});

test('OnMessage_GivenGuildIsNull_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockImplementation((name: string, args: string[], message: Message) => {
        return {
            valid: true
        }
    });

    let client = new Client();
    let guild = new Guild(client, {
        id: SnowflakeUtil.generate(),
    });
    let user = new User(client, {
        id: SnowflakeUtil.generate(),
    });
    let member = new GuildMember(
        client,
        {
            id: SnowflakeUtil.generate(),
            user: {
                id: user.id
            }
        },
        guild
    );
    let role = new Role(
        client,
        {
            id: SnowflakeUtil.generate()
        },
        guild
    );
    let message = new Message(
        client,
        {
            content: "!test first",
            author: {
                username: "test-user",
                discriminator: 1234
            },
            id: "test",
        },
        new DMChannel(
            client,
            {
                id: "channel-id",
            }
        )
    );

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Message was not sent in a guild, ignoring.");

    client.destroy();
});

test('OnMessage_GivenAuthorIsBot_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockImplementation((name: string, args: string[], message: Message) => {
        return {
            valid: true
        }
    });

    let client = new Client();
    let guild = new Guild(client, {
        id: SnowflakeUtil.generate(),
    });
    let user = new User(client, {
        id: SnowflakeUtil.generate(),
    });
    let member = new GuildMember(
        client,
        {
            id: SnowflakeUtil.generate(),
            user: {
                id: user.id
            }
        },
        guild
    );
    let role = new Role(
        client,
        {
            id: SnowflakeUtil.generate()
        },
        guild
    );
    let message = new Message(
        client,
        {
            content: "!test first",
            author: {
                username: "test-user",
                discriminator: 1234,
                bot: true,
            },
            id: "test",
        },
        new TextChannel(guild, {
        client: client,
        guild: guild,
        id: "channel-id",
      })
    );

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Message was sent by a bot, ignoring.");

    client.destroy();
});
