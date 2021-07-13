const { client } = require('../../../src');
const { readFileSync } = require('fs');

// Mocks
jest.mock('discord.js');

describe('Client Tests', () => {
    let instance;
    let config;
    let commandConfig;

    beforeEach(() => {
        config = JSON.parse(readFileSync('tests/json/config.json'));
        commandConfig = JSON.parse(readFileSync('tests/json/commandConfig.json'));
    });

    test('Configure Client (Correct paramaters)', () => {
        instance = new client(config, commandConfig);

        expect(instance.config).toBe(config);
        expect(instance.events).toBeDefined();
        expect(instance.util).toBeDefined();
    });

    test('Configure Client (Incorrect parameters: token)', () => {
        expect(() => {
            delete config.token;
            instance = new client(config, commandConfig);
        }).toThrow();
    });

    test('Configure Client (Incorrect parameters: prefix)', () => {
        expect(() => {
            delete config.prefix;
            instance = new client(config, commandConfig);
        }).toThrow();
    });

    test('Configure Client (Incorrect parameters: commands)', () => {
        expect(() => {
            delete config.commands;
            instance = new client(config, commandConfig);
        }).toThrow();
    });

    test('Configure Client (Incorrect parameters: events)', () => {
        expect(() => {
            delete config.events;
            instance = new client(config, commandConfig);
        }).toThrow();
    });

    test('Start Client', () => {
        instance = new client(config, commandConfig);
        instance.start();
    });
});