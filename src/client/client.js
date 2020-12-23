// Required Components
const { Client } = require('discord.js');
const { existsSync } = require('fs');

const events = require('./events');
const util = require('./util');

// Client Class
class client extends Client {
    constructor(config) {
	// Call Discord.JS Client
        super();

	// Set the client's configuration, initialise events, initialise utilities
        this.config = config;
        this.events = new events();
        this.util = new util(this);
    }

    // Method to start the bot
    start() {
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
	
	// Only allow config to be set once and only as a JSON object
        if (this._config) throw "Config has already been set";
        if (typeof config != "object") throw "Config is not a JSON object";

	// Make sure the token and prefix are strings
        if (typeof config.token != "string") throw "Token is not a string";
        if (typeof config.prefix != "string") throw "Prefix is not a string";

        // Make sure the command config string is set and the file exists
        if (typeof config.cmdconfig != "string") throw "Cmdconfig is not a string";
        if (!existsSync(config.cmdconfig)) throw `The file '${config.cmdconfig}' does not exist`;

	// Make sure commands and events are arrays, each item inside will be validated later
        if (typeof config.commands != "object") throw "Commands is not a string";
        if (typeof config.events != "object") throw "Events is not a string";


        this._config = config;
    }
}

module.exports = client;
