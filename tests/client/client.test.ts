import { CoreClient } from "../../src/client/client";

import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { Events } from "../../src/client/events";
import { Util } from "../../src/client/util";

jest.mock("discord.js");
jest.mock("dotenv");
jest.mock("../../src/client/events");
jest.mock("../../src/client/util");

test('Constructor_ExpectSuccessfulInitialisation', () => {
    const coreClient = new CoreClient();

    expect(coreClient).toBeInstanceOf(Client);
    expect(dotenv.config).toBeCalledTimes(1);
    expect(Events).toBeCalledTimes(1);
    expect(Util).toBeCalledTimes(1);
});

test('Start_GivenEnvIsValid_ExpectSuccessfulStart', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).not.toThrow();
    expect(coreClient.on).toBeCalledWith("message", expect.any(Function));
    expect(coreClient.on).toBeCalledWith("ready", expect.any(Function));
});

test('Start_GivenBotTokenIsNull_ExpectFailure', () => {
    process.env = {
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("BOT_TOKEN is not defined in .env");
});

test('Start_GivenBotTokenIsEmpty_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: '',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("BOT_TOKEN is not defined in .env");
});

test('Start_GivenBotPrefixIsNull_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("BOT_PREFIX is not defined in .env");
});

test('Start_GivenBotPrefixIsEmpty_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("BOT_PREFIX is not defined in .env");
});

test('Start_GivenFoldersCommandsIsNull_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("FOLDERS_COMMANDS is not defined in .env");
});

test('Start_GivenFoldersCommandsIsEmpty_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: '',
        FOLDERS_EVENTS: 'events',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("FOLDERS_COMMANDS is not defined in .env");
});

test('Start_GivenFoldersEventsIsNull_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("FOLDERS_EVENTS is not defined in .env");
});

test('Start_GivenFoldersCommandsIsEmpty_ExpectFailure', () => {
    process.env = {
        BOT_TOKEN: 'TOKEN',
        BOT_PREFIX: '!',
        FOLDERS_COMMANDS: 'commands',
        FOLDERS_EVENTS: '',
    }

    const coreClient = new CoreClient();
    
    expect(() => coreClient.start()).toThrow("FOLDERS_EVENTS is not defined in .env");
});