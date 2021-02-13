const { command } = require('../../src');

class test extends command {
    constructor() {
        super("test");
        super.users = "000000000000000001";
    }

    test(context) {
        context.message.reply(`Testing done by ${context.config.tester}`);
    }
}

module.exports = test;