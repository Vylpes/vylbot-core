const { Client } = require('discord.js');
const { existsSync } = require('fs');

const events = require('./events');
const util = require('./util');

class client extends Client {
    constructor(config) {
        super();
        this.config = config;
        this.events = new events();
        this.util = new util(this);
    }

    start() {
        super.on("message", this.events.message);
        super.on("ready", this.events.ready);
        super.login(this._config.token);

        this.util.loadEvents();
    }

    // Config
    get config() {
        return this._config;
    }

    set config(config) {
        // Validate the config
        if (this._config) throw "Config has already been set";
        if (typeof config != "object") throw "Config is not a JSON object";

        if (typeof config.token != "string") throw "Token is not a string";
        if (typeof config.prefix != "string") throw "Prefix is not a string";

        if (typeof config.commands != "string") throw "Commands is not a string";
        if (!existsSync(`${process.cwd()}/${config.commands}`)) throw "Commands folder doesn't exist";

        if (typeof config.events != "string") throw "Events is not a string";
        if (!existsSync(`${process.cwd()}/${config.events}`)) throw "Events folder doesn't exist";

        this._config = config;
    }
}

module.exports = client;