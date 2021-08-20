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

  const util = new Util();

  let client = new Client();
  let user = new User(client, {
    id: SnowflakeUtil.generate(),
    username: "test-user",
    discriminator: 1234,
  });
  let guild = new Guild(client, {
    id: SnowflakeUtil.generate(),
    members: [{
      user: user,
      nick: "Test User",
      roles: [],
      joined_at: "2015-04-26T06:26:56.936000+00:00",
      deaf: false,
      mute: false
    }]
  });
  let message = new Message(
    client,
    {
      content: "!test first",
      id: "test",
      member: {
        user: user,
        nick: "NOT API SUPPORT",
        roles: [],
        joined_at: "2015-04-26T06:26:56.936000+00:00",
        deaf: false,
        mute: false
      },
      type: 0,
      author: user,
    },
    new TextChannel(guild, {
      client: client,
      guild: guild,
      id: "channel-id",
    }),
  );

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeTruthy();

  client.destroy();
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

  const util = new Util();

  let client = new Client();
  let user = new User(client, {
    id: SnowflakeUtil.generate(),
    username: "test-user",
    discriminator: 1234,
  });
  let guild = new Guild(client, {
    id: SnowflakeUtil.generate(),
  });
  let message = new Message(
    client,
    {
      content: "!test first",
      id: "test",
      type: 0,
      author: user,
    },
    new TextChannel(guild, {
      client: client,
      guild: guild,
      id: "channel-id",
    }),
  );

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("Member is not part of message");

  client.destroy();
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

  const util = new Util();

  let client = new Client();
  let user = new User(client, {
    id: SnowflakeUtil.generate(),
    username: "test-user",
    discriminator: 1234,
  });
  let guild = new Guild(client, {
    id: SnowflakeUtil.generate(),
    members: [{
      user: user,
      nick: "Test User",
      roles: [],
      joined_at: "2015-04-26T06:26:56.936000+00:00",
      deaf: false,
      mute: false
    }]
  });
  let message = new Message(
    client,
    {
      content: "!test first",
      id: "test",
      member: {
        user: user,
        nick: "NOT API SUPPORT",
        roles: [],
        joined_at: "2015-04-26T06:26:56.936000+00:00",
        deaf: false,
        mute: false
      },
      type: 0,
      author: user,
    },
    new TextChannel(guild, {
      client: client,
      guild: guild,
      id: "channel-id",
    }),
  );

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("Command folder does not exist");

  client.destroy();
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

  const util = new Util();

  let client = new Client();
  let user = new User(client, {
    id: SnowflakeUtil.generate(),
    username: "test-user",
    discriminator: 1234,
  });
  let guild = new Guild(client, {
    id: SnowflakeUtil.generate(),
    members: [{
      user: user,
      nick: "Test User",
      roles: [],
      joined_at: "2015-04-26T06:26:56.936000+00:00",
      deaf: false,
      mute: false
    }]
  });
  let message = new Message(
    client,
    {
      content: "!test first",
      id: "test",
      member: {
        user: user,
        nick: "NOT API SUPPORT",
        roles: [],
        joined_at: "2015-04-26T06:26:56.936000+00:00",
        deaf: false,
        mute: false
      },
      type: 0,
      author: user,
    },
    new TextChannel(guild, {
      client: client,
      guild: guild,
      id: "channel-id",
    }),
  );

  const result = util.loadCommand("name", [ "first" ], message);

  expect(result.valid).toBeFalsy();
  expect(result.message).toBe("File does not exist");

  client.destroy();
});

test('LoadCommand_GivenUserHasRole_ExpectSuccessfulResult', () => {
  process.env = {
    BOT_TOKEN: 'TOKEN',
    BOT_PREFIX: '!',
    FOLDERS_COMMANDS: 'commands',
    FOLDERS_EVENTS: 'events',
  }
  
  process.cwd = jest.fn().mockReturnValue("../../tests/__mocks");
  fs.existsSync = jest.fn().mockReturnValue(true);

  let message = {
    member: {
      roles: {
        cache: {
          find: jest.fn().mockReturnValue(true),
        }
      },
    }
  } as unknown as Message;

  const util = new Util();

  const result = util.loadCommand("roles", [ "first" ], message);

  expect(result.valid).toBeTruthy();
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

  let message = {
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