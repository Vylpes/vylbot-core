const event = require('../../../src/type/event');

describe('Event: constructor', () => {
    let instance;

    beforeEach(() => {
        instance = new event("test");
    });

    test('Event run is set correctly', () => {
        expect(instance.run).toBe("test");
    });
}); 