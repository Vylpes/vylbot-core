const { generateResponse, validateConfig } = require('../../../src/client/validation');
const { readFileSync } = require('fs');

describe('Validation: generateResponse', () => {
    test('Returns the corect response', () => {
        const isValidWithMessage = generateResponse(true, "Test Message");
        const isValidNoMessage = generateResponse(true);
        const notValidWithMessage = generateResponse(false, "Test Message");
        const notValidNoMessage = generateResponse(false);

        expect(isValidWithMessage.valid).toBe(true);
        expect(isValidWithMessage.message).toBe('Test Message');

        expect(isValidNoMessage.valid).toBe(true);
        expect(isValidNoMessage.message).toBe('No message was given');

        expect(notValidWithMessage.valid).toBe(false);
        expect(notValidWithMessage.message).toBe('Test Message');

        expect(notValidNoMessage.valid).toBe(false);
        expect(notValidNoMessage.message).toBe('No message was given');
    });
});

describe('Validation: validateConfig', () => {
    let config;
    let expected;

    beforeEach(() => {
        config = JSON.parse(readFileSync('tests/json/config.json'));
        expected = JSON.parse(readFileSync('src/json/expectedConfig.json'));
    });

    test('Validates expected config as valid', () => {
        const res = validateConfig(config, expected);

        expect(res.valid).toBe(true);
        expect(res.message).toBe('No message was given');
    });

    test('Validates unexpected config as invalid (token)', () => {
        delete config.token;
        const res = validateConfig(config, expected);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("'token' is not defined");
    });

    test('Validates unexpected config as invalid (prefix)', () => {
        delete config.prefix;
        const res = validateConfig(config, expected);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("'prefix' is not defined");
    });

    test('Validates unexpected config as invalid (commands)', () => {
        delete config.commands;
        const res = validateConfig(config, expected);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("'commands' is not defined");
    });

    test('Validates unexpected config as invalid (events)', () => {
        delete config.events;
        const res = validateConfig(config, expected);

        expect(res.valid).toBe(false);
        expect(res.message).toBe("'events' is not defined");
    });
});