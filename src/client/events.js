// Events Class
class event {
    // Emit when a message is sent
    // Used to check for commands
    message(message) {
        // Make sure command is sent within a guild and not by a bot, otherwise return and ignore
        if (!message) return false;
        if (!message.guild) return false;
        if (message.author.bot) return false;

        // Get the prefix from the config
        const prefix = this.config.prefix;

        // If the message starts with the prefix, then treat it as a command
        if (message.content.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
            // Get the arguments in the message, after the first space (after the command name)
            const args = message.content.substring(prefix.length).split(" ");
            const name = args.shift();

            // Load the command from the util class
            const res = this.util.loadCommand(name, args, message);

            if (!res.valid) {
                if (res.message != 'File does not exist') throw res.message;
            }

            return {
                "prefix": prefix,
                "name": name,
                "args": args,
                "message": message
            };
        }

        return false;
    }

    // Emit when bot is logged in and ready to use
    ready() {
        console.log("Ready");
    }
}

module.exports = event;
