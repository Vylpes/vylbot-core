import { Events } from "../../src/client/events";

import { Message, Client, TextChannel, Guild, SnowflakeUtil, DMChannel } from "discord.js";
import { Util } from "../../src/client/util";

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
    };

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });

    const message = {
        guild: {},
        author: {
            bot: false,
        },
        content: "!test first",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeTruthy();

    expect(result.context?.prefix).toBe('!');
    expect(result.context?.name).toBe('test');
    expect(result.context?.args.length).toBe(1);
    expect(result.context?.args[0]).toBe('first');
    expect(result.context?.message).toBe(message);
});

test('OnMessage_GivenGuildIsNull_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });

    const message = {
        guild: null,
        author: {
            bot: false,
        },
        content: "!test first",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Message was not sent in a guild, ignoring.");
});

test('OnMessage_GivenAuthorIsBot_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });

    const message = {
        guild: {},
        author: {
            bot: true,
        },
        content: "!test first",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Message was sent by a bot, ignoring.");
});

test('OnMessage_GivenMessageContentsWasNotACommand_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });

    const message = {
        guild: {},
        author: {
            bot: false,
        },
        content: "This is a standard message",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Message was not a command, ignoring.");
});

test('OnMessage_GivenMessageHadNoCommandName_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });

    const message = {
        guild: {},
        author: {
            bot: false,
        },
        content: "!",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command name was not found");
});

test('OnMessage_GivenCommandFailedToExecute_ExpectFailedResult', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: false, message: "Command failed" });

    const message = {
        guild: {},
        author: {
            bot: false,
        },
        content: "!test first",
    } as unknown as Message;

    const events = new Events();

    const result = events.onMessage(message);

    expect(result.valid).toBeFalsy();
    expect(result.message).toBe("Command failed");
});

test('OnReady_ExpectConsoleLog', () => {
    console.log = jest.fn();

    const events = new Events();

    events.onReady();

    expect(console.log).toBeCalledWith("Ready");
});