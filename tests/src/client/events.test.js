const events = require('../../../src/client/events');
const { readFileSync } = require('fs');
const { expect } = require('@jest/globals');

// Mocks
jest.mock('discord.js');

describe('events.message', () => {
    let instance;
    let message;
    let config;

    beforeEach(() => {
        instance = new events();
        message = JSON.parse(readFileSync('tests/json/message.json'));
        config = JSON.parse(readFileSync('tests/json/config.json'));

        instance.config = config;

        instance.util = jest.fn();
        instance.util.loadCommand = jest.fn(() => {
            return {
                "valid": true,
                "message": "No message was set"
            }
        });
    });

    test('If no message should return', () => {
        const res = instance.message();

        expect(res).toBe(false);
    });

    test('If no guild should return', () => {
        delete message.guild;
        const res = instance.message(message);

        expect(res).toBe(false);
    });

    test('If author is a bot should return', () => {
        message.author.bot = true;
        const res = instance.message(message);

        expect(res).toBe(false);
    });

    test('Should loadCommand', () => {
        const res = instance.message(message);

        expect(instance.util.loadCommand).toHaveBeenCalledTimes(1);
        expect(instance.util.loadCommand).toHaveBeenCalledWith('testing', ['param1'], message);
    });

    test('Should return correct values', () => {
        const res = instance.message(message);

        expect(res.prefix).toBe('d!');
        expect(res.name).toBe('testing');
        expect(res.args[0]).toBe('param1');
        expect(res.message).toBe(message);
    });

    test('Should throw if response is invalid', () => {
        instance.util.loadCommand = jest.fn(() => {
            return {
                "valid": false,
                "message": "Invalid"
            }
        });

        expect(() => {
            instance.message(message)
        }).toThrow('Invalid');
    });

    test('Should not throw if file does not exist', () => {
        instance.util.loadCommand = jest.fn(() => {
            return {
                "valid": false,
                "message": "File does not exist"
            }
        });

        expect(() => {
            instance.message(message)
        }).not.toThrow();
    });

    test('Should return if message doesnt have prefix', () => {
        message.content = "Just a normal message";
        const res = instance.message(message);

        expect(res).toBe(false);
    });
});

describe('events.ready', () => {
    let instance;
    let message;
    let config;

    beforeEach(() => {
        instance = new events();
        message = JSON.parse(readFileSync('tests/json/message.json'));
        config = JSON.parse(readFileSync('tests/json/config.json'));

        instance.config = config;

        instance.util = jest.fn();
        instance.util.loadCommand = jest.fn(() => {
            return {
                "valid": true,
                "message": "No message was set"
            }
        });

        console = jest.fn();
        console.log = jest.fn();
    });

    test('Should log when ready', () => {
        const res = instance.ready();

        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith("Ready");
    });
});