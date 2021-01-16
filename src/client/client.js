// Required Components
const { Client } = require('discord.js');
const { validateConfig } = require('./validation');

const events = require('./events');
const util = require('./util');

// Required JSON
const expectedConfig = require('../json/expectedConfig.json');

// Client Class
class client extends Client {
    constructor(config, commandConfig) {
    // Call Discord.JS Client
        super();

    // Set the client's configuration, initialise events, initialise utilities
        this.config = config;
        this.commandConfig = commandConfig;
        this.events = new events();
        this.util = new util(this);
    }

    // Method to start the bot
    start() {
        // Check the bot is ready to start
        if (!this._config) throw "Config has not been set";
        if (!this._commandConfig) throw "Command Config has not been set";

        // Events to handle commands
        super.on("message", this.events.message);
        super.on("ready", this.events.ready);

            // Login to discord using Discord.JS
        super.login(this._config.token);

        // Load events
        this.util.loadEvents();
    }

    // Config
    get config() {
        return this._config;
    }

    set config(config) {
        // Validate the config
        const val = validateConfig(config, expectedConfig);
        if (!val.valid) throw val.message;

        this._config = config;
    }

    // Command Config
    get commandConfig() {
        return this._commandConfig;
    }

    set commandConfig(config) {
        this._commandConfig = config;
    }
}

module.exports = client;
