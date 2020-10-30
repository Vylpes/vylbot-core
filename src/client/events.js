// Events Class
class event {
    // Emit when a message is sent
    // Used to check for commands
    message(message) {
	// Make sure command is sent within a guild and not by a bot, otherwise return and ignore
        if (!message.guild) return;
        if (message.author.bot) return;

	// Get the prefix from the config
        let prefix = this.config.prefix;

        // If the message starts with the prefix, then treat it as a command
        if (message.content.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
            // Get the arguments in the message, after the first space (after the command name)
            let args = message.content.substring(prefix.length).split(" ");
            let name = args.shift();

            // Load the command from the util class
            this.util.loadCommand(name, args, message);
        }
    }

    // Emit when bot is logged in and ready to use
    ready() {
        console.log("Ready");
    }
}

module.exports = event;
