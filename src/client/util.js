// Required Components
const { readdirSync, existsSync } = require('fs');

function generateResponse(isValid, message) {
    return {
        "valid": isValid,
        "message": message || "No message was given"
    }
}

// Util Class
class util {
    constructor(client) {
	// Set the client
        this._client = client;
    }

    // Load a command and send the arguments with it
    loadCommand(name, args, message) {
        // Get the current folder to check
        const folder = this._client.config.commands;

        if (existsSync(`${process.cwd()}/${folder}/${name}.js`)) {
            // Require the command file, now that we know it exists and initialise it
            const commandFile = require(`${process.cwd()}/${folder}/${name}.js`);
            const command = new commandFile();

            // Require the command config file and get the config for the current command
            const configJson = this._client.commandConfig;
            const config = configJson[name];

            // Get the list of required configurations the command needs
            const commandConfigs = command.configs;

            // Loop through all the required configs of the command
            for (const i in commandConfigs) {
                // If the command doesn't have the configs in the config string, throw an error
                if (!config) return generateResponse(false, `${commandFile.name} requires ${commandConfigs[i]} in it's configuration`);
                if (!config[commandConfigs[i]]) return generateResponse(false, `${commandFile.name} requires ${commandConfigs[i]} in it's configuration`);
            }

            // Get the roles required for this command to run
            const requiredRoles = command.roles;

            // Get the category, if there is no category, set it to a default string
            if (!command.category) command.category = "none";

            // Loop through all roles required
            for (const i in requiredRoles) {
                // If the user doesn't have a required role, don't run the command and let the user know
                if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                    message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);
                    return generateResponse(false, `You require the \`${requiredRoles[i]}\` role to run this command`);
                }
            }

            // Get the ids of the users that are only permitted to run this command
            const users = command.users;

            // If the command has any limits, limit the command, otherwise default to anyone
            if (users.length > 0) {
                if (!users.includes(message.member.id)) {
                    message.reply(`You do not have permission to run this command`);
                    return generateResponse(false, "You do not have permission to run this command");
                }
            }

            // Run the command and pass the command context with it
            command[command.run]({
                "command": name,
                "arguments": args,
                "client": this._client,
                "message": message,
                "config": config,
                "commandConfigs": commandConfigs
            });

            return generateResponse(true, `loaded command '${name}' with arguments '${args}'`);
        } else {
            return generateResponse(false, 'File does not exist');
        }
    }

    // Load the events
    loadEvents() {
        // Get the current folder to check
        const folder = this._client.config.events;

        // Get the files inside of this folder
        const eventFiles = readdirSync(`${process.cwd()}/${folder}/`);

        // Loop through all the files in the folder
        for (let i = 0; i < eventFiles.length; i++) {
            // Ignore non-javascript files
            if (eventFiles[i].includes('.js')) {
                // Get the event name, by taking the command file and removing the ".js" from the end
                const eventName = eventFiles[i].split('.')[0];

                // Get the file of the event
                const file = require(`${process.cwd()}/${folder}/${eventName}.js`);

                // Initialise the event class
                const event = new file;

                // Set the client to emit to this event
                this._client.on(eventName, event[event.run]);
            }
        }
    }
}

module.exports = util;
