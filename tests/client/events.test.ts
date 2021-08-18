import { Events } from "../../src/client/events";

import { Message, Client, TextChannel, Guild, SnowflakeUtil, DMChannel } from "discord.js";
import { Util } from "../../src/client/util";

jest.mock("dotenv");
jest.mock("../../src/client/util");

beforeEach(() => {
    Util.prototype.loadCommand = jest.fn();
});

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

test('OnMessage_GivenMessageContentsWasNotACommand_ExpectFailedResult', () => {
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
    let message = new Message(
        client,
        {
            content: "This is a standard message without a prefix",
            author: {
                username: "test-user",
                discriminator: 1234,
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
    expect(result.message).toBe("Message was not a command, ignoring.");

    client.destroy();
});

test('OnMessage_GivenMessageHadNoCommandName_ExpectFailedResult', () => {
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
    let message = new Message(
      discordClient,
      {
        content: "!",
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

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command name was not found");

    discordClient.destroy();
});

test('OnMessage_GivenCommandFailedToExecute_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockImplementation((name: string, args: string[], message: Message) => {
        return { 
            valid: false,
            message: "Command failed",
        }
    });

    let discordClient = new Client();
    let guild = new Guild(discordClient, {
      id: SnowflakeUtil.generate(),
    });
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

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command failed");

    discordClient.destroy();
});

test('OnReady_ExpectConsoleLog', () => {
    console.log = jest.fn();

    const events = new Events();

    events.onReady();

    expect(console.log).toBeCalledWith("Ready");
});