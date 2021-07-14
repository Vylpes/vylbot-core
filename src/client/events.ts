import { Message } from "discord.js";
import { IBaseResponse } from "../contracts/IBaseResponse";
import { Util } from "./util";

export interface IEventResponse extends IBaseResponse {
    context?: {
        prefix: string;
        name: string;
        args: string[];
        message: Message;
    }
}

export class Events {
    private _util: Util;

    constructor() {
        this._util = new Util();
    }

    // Emit when a message is sent
    // Used to check for commands
    public onMessage(message: Message): IEventResponse {
        if (!message) return {
            valid: false,
            message: "Message was not supplied.",
        };

        if (!message.guild) return {
            valid: false,
            message: "Message was not sent in a guild, ignoring.",
        };

        if (message.author.bot) return {
            valid: false,
            message: "Message was sent by a bot, ignoring.",
        };

        const prefix = process.env.BOT_PREFIX as string;

        if (message.content.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
            const args = message.content.substring(prefix.length).split(" ");
            const name = args.shift();

            if (!name) return {
                valid: false,
                message: "Command name was not found",
            };

            const res = this._util.loadCommand(name, args, message);

            if (!res.valid) {
                if (res.message != 'File does not exist') return {
                    valid: false,
                    message: res.message,
                };
            }

            return {
                valid: true,
                context: {
                    prefix: prefix,
                    name: name,
                    args: args,
                    message: message,
                },
            };
        }

        return {
            valid: true,
            message: "Message was not a command, ignoring.",
        }
    }

    // Emit when bot is logged in and ready to use
    public onReady() {
        console.log("Ready");
    }
}
