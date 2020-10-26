# VylBot Core Documentation

Welcome to the VylBot Core documentation. In this file we will explain how to setup and use VylBot Core in your project.

## Contents

1. Initial Setup
2. Configuring the client
3. Creating a command
4. Handling an event

## 1. Initial Setup

To setup the package, download it from `npm`

```bash
cd <project-folder>
npm install vylbot-core
```

Add to your .js file

```js
const vylbot = require('vylbot-core');
const config = require('config.json');

const client = new vylbot.client(config);
client.start();
```

## 2. Configuring the client

When creating a new `vylbot.client` object you need to pass through some json configuration. This can be either from a .json file or directly written. 

> **Note:** We recommend using a .json file and adding it to your `.gitignore` file to prevent accidentally publishing your bot token.

An example configuration:

```json
{
    "token": "<YOUR-BOT-TOKEN>",
    "prefix": "!",
    "commands": [
        "commands"
    ],
    "events": [
        "events"
    ]
}
```

Make sure the folders that you set for `commands` and `events` exist and are at your project's current working directory.

## 3. Creating a command

A basic command goes as follows:

```js
// commands/test.js
const { command } = require('vylbot-core');

class test extends command {
    constructor() {
        super("test");
        super.description = "Test description";
        super.category = "general";
        super.requiredConfigs = "link";
        super.roles = "Moderator";
        super.roles = "Admin";
        super.users = "<ID-HERE>";
    }

    test(context) {
        context.message.channel.send("Hello there, " + context.config.link);
    }
}

module.exports = test;
```

1. You create a class and export it using `module.exports` and make it extend the vylbot's `command` class.
2. In the `constructor()` you need to call `super(run)`, replacing `run` with a string of the name of the method which will run when the command runs.
3. Call any of the `super` variables to give it some description, the current ones you can use are: `description`, `category`, `usage`
4. If you want the command to only be allowed to run by people with a role, set the role name in `super.roles`

> **Note:** You can set more than one role to be required by setting `super.roles` again.

5. If you want the command to only be ran by specific users, set their ID in `super.users`

> **Note:** You can set more than one user to be required by settubg `super.users` again.

6. If you want the command to require a variable in the config, set the name in `super.requiredConfigs`

> **Note:** You can set more than one role to be required by setting `super.requiredConfigs` again.

7. Create a method using the name you set in `super(run)`, with the `context` as its parameter.

The `context` parameter will be a JSON object of:

```json
{
    "command": "<Command Name>",
    "arguments": "<Command Arguments>",
    "client": "<Bot Client Object",
    "message": "Discord.js Message Object",
    "config": "The command's config (if any)"
}
```

The command's config will be stored under the command's name, for example, if a command called `test` has set `super.requiredConfigs = "link"`, it will be set in the config as `test.link`.

## 4. Handling an event

A basic event handling goes as follows:

```js
// events/message.js
const { event } = require('vylbot-core');

class message extends event {
    constructor() {
        super("message");
    }

    message(message) {
        console.log("Message received: " + message.content);
    }
}

module.exports = message;
```

1. You create a class and export it using `module.exports` and make it extend the vylbot's `event` class.
2. In the `constructor()` you need to call `super(run)`, replacing `run` with a string of the name of the method which will run when the event gets triggered.
3. Create a method using the name you set in `super(run)`, with the parameters being as per your event's paramaters in the discord.js documentation.

> **Note:** The name of the event file will determine what event it will be triggered on. For example, if you want to have an event trigger everytime a message is sent, put into your event folder a file called `message.js` and follow the steps above.
