const command = require('../../../src/type/command');

describe('Command: constructor', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Command run is set correctly', () => {
        expect(instance.run).toBe("test");
    });

    test('Command roles is set correctly', () => {
        expect(typeof instance._roles).toBe('object');
        expect(instance._roles.length).toBe(0);
    });

    test('Command configs is set correctly', () => {
        expect(typeof instance._configs).toBe('object');
        expect(instance._configs.length).toBe(0);
    });

    test('Command users is set correctly', () => {
        expect(typeof instance._users).toBe('object');
        expect(instance._users.length).toBe(0);
    });
});

describe('Command: description', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting description', () => {
        instance.description = "desc";
        expect(instance._description).toBe("desc");
    });

    test('Getting description', () => {
        instance.description = "desc";
        expect(instance.description).toBe("desc");
    });
});

describe('Command: category', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting category', () => {
        instance.category = "cat";
        expect(instance._category).toBe("cat");
    });

    test('Getting category', () => {
        instance.category = "cat";
        expect(instance.category).toBe("cat");
    });
});

describe('Command: usage', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting usage', () => {
        instance.usage = "use";
        expect(instance._usage).toBe("use");
    });

    test('Getting usage', () => {
        instance.usage = "use";
        expect(instance.usage).toBe("use");
    });
});

describe('Command: roles', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting roles (1 role)', () => {
        instance.roles = "role0";
        expect(instance._roles.length).toBe(1);
        expect(instance._roles[0]).toBe("role0");
    });

    test('Getting roles (1 role)', () => {
        instance.roles = "role0";
        expect(instance.roles.length).toBe(1);
        expect(instance.roles[0]).toBe("role0");
    });

    test('Setting roles (2 roles)', () => {
        instance.roles = "role0";
        instance.roles = "role1";
        expect(instance._roles.length).toBe(2);
        expect(instance._roles[0]).toBe("role0");
        expect(instance._roles[1]).toBe("role1");
    });

    test('Getting roles (2 roles)', () => {
        instance.roles = "role0";
        instance.roles = "role1";
        expect(instance.roles.length).toBe(2);
        expect(instance.roles[0]).toBe("role0");
        expect(instance.roles[1]).toBe("role1");
    });
});

describe('Command: configs', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting configs (1 config)', () => {
        instance.configs = "config0";
        expect(instance._configs.length).toBe(1);
        expect(instance._configs[0]).toBe("config0");
    });

    test('Getting configs (1 config)', () => {
        instance.configs = "config0";
        expect(instance.configs.length).toBe(1);
        expect(instance.configs[0]).toBe("config0");
    });

    test('Setting configs (2 configs)', () => {
        instance.configs = "config0";
        instance.configs = "config1";
        expect(instance._configs.length).toBe(2);
        expect(instance._configs[0]).toBe("config0");
        expect(instance._configs[1]).toBe("config1");
    });

    test('Getting configs (2 configs)', () => {
        instance.configs = "config0";
        instance.configs = "config1";
        expect(instance.configs.length).toBe(2);
        expect(instance.configs[0]).toBe("config0");
        expect(instance.configs[1]).toBe("config1");
    });
});

describe('Command: users', () => {
    let instance;

    beforeEach(() => {
        instance = new command("test");
    });

    test('Setting users (1 user)', () => {
        instance.users = "user0";
        expect(instance._users.length).toBe(1);
        expect(instance._users[0]).toBe("user0");
    });

    test('Getting users (1 user)', () => {
        instance.users = "user0";
        expect(instance.users.length).toBe(1);
        expect(instance.users[0]).toBe("user0");
    });

    test('Setting users (2 user)', () => {
        instance.users = "user0";
        instance.users = "user1";
        expect(instance._users.length).toBe(2);
        expect(instance._users[0]).toBe("user0");
        expect(instance._users[1]).toBe("user1");
    });

    test('Getting users (2 users)', () => {
        instance.users = "user0";
        instance.users = "user1";
        expect(instance.users.length).toBe(2);
        expect(instance.users[0]).toBe("user0");
        expect(instance.users[1]).toBe("user1");
    });
});