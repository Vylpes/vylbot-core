const { stat, readdirSync } = require('fs');
const { config } = require('process');

class util {
    constructor(client) {
        this._client = client;
    }

    loadCommand(name, args, message) {
        stat(`${process.cwd()}/${this._client.config.commands}/${name}.js`, (err, stat) => {
            if (err == null) {
                let commandFile = require(`${process.cwd()}/${this._client.config.commands}/${name}.js`);
                let command = new commandFile();
                
                let requiredConfigs = command.requiredConfigs;
                
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

    loadEvents() {
        let eventFiles = readdirSync(`${process.cwd()}/${this._client.config.events}/`);

        for (let i = 0; i < eventFiles.length; i++) {
            let eventName = eventFiles[i].split('.')[0];
            let file = require(`${process.cwd()}/${this._client.config.events}/${eventName}.js`);
            
            let event = new file;

            this._client.on(eventName, event[event.run]);
        }
    }
}

module.exports = util;