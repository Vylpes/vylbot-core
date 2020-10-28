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
                         if (!this._client.config[name]) throw `${commandFile.name} requires ${requiredConfigs[i]} in it's configuration`;
                             if (!this._client.config[name][requiredConfigs[i]]) throw `${commandFile.name} requires ${requiredConfigs[i]} in it's configuration`;
                         }

                        let requiredRoles = command.roles;

                        for (let i = 0; i < requiredRoles.length; i++) {
                            if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                                message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);
                                return;
                            }
                        }

                    let users = command.users;

                    if (!users.includes(message.member.id)) {
                        message.reply(`You do not have permission to run this command`);
                        return;
                    }

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

    loadEvents() {
        for (let e = 0; e < this._client.config.events.length; e++) {
            let folder = this._client.config.events[e];

            let eventFiles = readdirSync(`${process.cwd()}/${folder}/`);
    
            for (let i = 0; i < eventFiles.length; i++) {
                let eventName = eventFiles[i].split('.')[0];
                let file = require(`${process.cwd()}/${folder}/${eventName}.js`);
    
                let event = new file;
    
                this._client.on(eventName, event[event.run]);
            }
        }
    }
}

module.exports = util;
