const discord = require('discord.js');

module.exports = {
    client: require('./client/client'),
    command: require('./type/command'),
    event: require('./type/event')
}