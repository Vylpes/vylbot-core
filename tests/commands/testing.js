const { command } = require('../../src');

class test extends command {
    constructor() {
        super("test");
        super.configs = "tester";
    }

    test(context) {
        context.message.reply(`Testing done by ${context.config.tester}`);
    }
}

module.exports = test;