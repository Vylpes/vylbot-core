import { Events } from "../../src/client/events";

import { Message, Client, User, GuildMember, TextChannel, Guild, SnowflakeUtil, Role } from "discord.js";
import * as dotenv from "dotenv";
import { Util } from "../../src/client/util";

jest.mock("dotenv");
jest.mock("../../src/client/util");

test('Start_GivenMessageIsValid_ExpectMessageSent', () => {
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
        author: { username: "BiggestBulb", discriminator: 1234 },
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
