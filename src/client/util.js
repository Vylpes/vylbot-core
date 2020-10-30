// Required Components
const { stat, readdirSync } = require('fs');
const { config } = require('process');

// Util Class
class util {
    constructor(client) {
	// Set the client
        this._client = client;
    }

    // Load a command and send the arguments with it
    loadCommand(name, args, message) {
	// Loop through all folders set in config
	// c = command folder index
        for (let c = 0; c < this._client.config.commands.length; c++) {
	    // Get the current folder to check
            let folder = this._client.config.commands[c];

	    // See if the folder being checked has the command being sent
            stat(`${process.cwd()}/${folder}/${name}.js`, err => {
		// If no error, attempt to run the command
                if (err == null) {
		    // Require the command file, now that we know it exists and initialise it
                    let commandFile = require(`${process.cwd()}/${folder}/${name}.js`);
                    let command = new commandFile();

		    // Get the list of required configurations the command needs
                    let requiredConfigs = command.requiredConfigs;

		    // Loop through all the required configs of the command
                    for (let i = 0; i < requiredConfigs.length; i++) {
                        // If the command doesn't have the configs in the config string, throw an error
                        if (!this._client.config[name]) throw `${commandFile.name} requires ${requiredConfigs[i]} in it's configuration`;
                        if (!this._client.config[name][requiredConfigs[i]]) throw `${commandFile.name} requires ${requiredConfigs[i]} in it's configuration`;
                    }

                    // Get the roles required for this command to run
                    let requiredRoles = command.roles;

                    // Loop through all roles required
                    for (let i = 0; i < requiredRoles.length; i++) {
                        // If the user doesn't have a required role, don't run the command and let the user know
                        if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                            message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);
                            return;
                        }
                    }

                    // Get the ids of the users that are only permitted to run this command
                    let users = command.users;

                    // If the user isn't in the list, don't run the command
                    if (!users.includes(message.member.id)) {
                        message.reply(`You do not have permission to run this command`);
                        return;
                    }

                    // Run the command and pass the command context with it
                    command[command.run]({
                        "command": name,
                        "arguments": args,
                        "client": this._client,
                        "message": message,
                        "config": config
                    });
                 } else if (err.code === 'ENOENT') {
                    // FILE DOESN'T EXIST
                 }
            });
        }
    }

    // Load the events
    loadEvents() {
        // Loop through all the event folders
        for (let e = 0; e < this._client.config.events.length; e++) {
            // Get the current folder to check
            let folder = this._client.config.events[e];

            // Get the files inside of this folder
            let eventFiles = readdirSync(`${process.cwd()}/${folder}/`);
    
            // Loop through all the files in the folder
            for (let i = 0; i < eventFiles.length; i++) {
                // Get the event name, by taking the command file and removing the ".js" from the end
                let eventName = eventFiles[i].split('.')[0];

                // Get the file of the event
                let file = require(`${process.cwd()}/${folder}/${eventName}.js`);
    
                // Initialise the event class
                let event = new file;
    
                // Set the client to emit to this event
                this._client.on(eventName, event[event.run]);
            }
        }
    }
}

module.exports = util;
