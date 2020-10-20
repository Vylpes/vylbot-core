class event {
    message(message) {
        if (!message.guild) return;
        if (message.author.bot) return;

        let prefix = this.config.prefix;

        if (message.content.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
            let args = message.content.substring(prefix.length).split(" ");
            let name = args.shift();

            this.util.loadCommand(name, args, message);
        }
    }

    ready() {
        console.log("Ready");
    }
}

module.exports = event;