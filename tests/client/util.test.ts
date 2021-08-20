import { Util } from "../../src/client/util";

import { Client, Guild, Message, Role, SnowflakeUtil, TextChannel, User } from "discord.js";
import fs from "fs";

jest.mock("fs");

beforeEach(() => {
  fs.existsSync = jest.fn();
});

test('LoadCommand_GivenSuccessfulExection_ExpectSuccessfulResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(true);

  const message = {
    member: {
      roles: {
        cache: {
          find: jest.fn().mockReturnValue(true),
        }
      },
    },
    reply: jest.fn(),
  } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeTruthy();
});

test('LoadCommand_GivenMemberIsNull_ExpectFailedResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(true);

  const message = {
    member: null
  } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("Member is not part of message");
});

test('LoadCommand_GivenFolderDoesNotExist_ExpectFailedResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(false);

  const message = {
    member: {
      roles: {
        cache: {
          find: jest.fn().mockReturnValue(true),
        }
      },
    },
    reply: jest.fn(),
  } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("Command folder does not exist");
});

test('LoadCommand_GivenFileDoesNotExist_ExpectFailedResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValueOnce(true)
    .mockReturnValue(false);

    const message = {
      member: {
        roles: {
          cache: {
            find: jest.fn().mockReturnValue(true),
          }
        },
      },
      reply: jest.fn(),
    } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("File does not exist");
});

test('LoadCommand_GivenUserDoesNotHaveRole_ExpectFailedResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(true);

  const message = {
    member: {
      roles: {
        cache: {
          find: jest.fn().mockReturnValue(false),
        }
      },
    },
    reply: jest.fn(),
  } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("roles", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("You require the `Moderator` role to run this command");
});

test('LoadEvents_GivenEventsAreLoaded_ExpectSuccessfulResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }

  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.readdirSync = jest.fn().mockReturnValue(["name.ts"]);

  const client = {
    on: jest.fn(),
  } as unknown as Client;

  const util = new Util();

  const result = util.loadEvents(client);

  const clientOn = jest.spyOn(client, 'on');

  expect(result.valid).toBeTruthy();
  expect(clientOn).toBeCalledTimes(13);
});

test('LoadEvents_GivenEventFolderDoesNotExist_FailedResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }

  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(false);
  fs.readdirSync = jest.fn().mockReturnValue(["name.ts"]);

  const client = {
    on: jest.fn(),
  } as unknown as Client;

  const util = new Util();

  const result = util.loadEvents(client);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("Event folder does not exist");
});