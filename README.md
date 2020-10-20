# VylBot Core

Discord bot client based upon Discord.js 

## Installation

Download the latest version from the [releases page](https://github.com/Vylpes/vylbot-core/releases).

Copy the config template file and fill in the strings.

```json
{
    "token": "",
    "prefix": "",
    "commands": "",
    "events": ""
}
```

* **Token:** Your bot's token
* **Prefix** The command prefix
* **Commands:** The folder name containing your commands
* **Events:** The folder name containing your events

## Usage

Implement the client using something like:

```js
const vylbot = require('vylbot-core');
const config = require('config.json');

const client = new vylbot.client(config);
client.start();
```

See the `docs` folder for more information on how to use vylbot-core

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

We will not merge pull requests unless all checks pass and at least one of the repo members approves it.

See CONTRIBUTING.md for more details.
