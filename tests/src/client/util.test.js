const util = require('../../../src/client/util');
const { readFileSync, read } = require('fs');

// Mocks
jest.mock('discord.js');
const fs = jest.createMockFromModule('fs');

fs.stat = jest.fn((path, cb) => {
    cb(null);
});

describe('util.constructor', () => {
    let instance;
    let client;

    beforeEach(() => {
        client = jest.fn();
        instance = new util(client);
    });

    test('Should set client', () => {
        expect(instance._client).toBeDefined();
    });
});

describe('util.loadCommand', () => {
    let instance;
    let message;
    let client;

    beforeEach(() => {
        client = jest.fn();
        client.config = JSON.parse(readFileSync('tests/json/config.json'));
        client.commandConfig = JSON.parse(readFileSync('tests/json/commandConfig.json'));

        instance = new util(client);
        message = JSON.parse(readFileSync('tests/json/message.json'));
        message.reply = jest.fn();
    });

    test('Should load command correctly', () => {
        let res = instance.loadCommand('testing', 'param1', message);

        expect(res.valid).toBe(true);
        expect(res.message).toBe("loaded command 'testing' with arguments 'param1'");
    });

    test('Should load command correctly (no arguments)', () => {
        let res = instance.loadCommand('testing', '', message);

        expect(res.valid).toBe(true);
        expect(res.message).toBe("loaded command 'testing' with arguments ''");
    });

    test('Should be invalid if it tries to load an undefined command', () => {
        let res = instance.loadCommand('testingz', '', message);

        expect(res.valid).toBe(false);
        expect(res.message).toBe('File does not exist');
    });

    test('Should be invalid if incorrect configs', () => {
        delete client.commandConfig.testing;
        let res = instance.loadCommand('testing', 'param1', message);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("test requires tester in it's configuration");
    });

    test('Should be invalid if incorrect configs (single config)', () => {
        delete client.commandConfig.testing.tester;
        let res = instance.loadCommand('testing', 'param1', message);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("test requires tester in it's configuration");
    });
});
