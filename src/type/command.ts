import { Message } from "discord.js";

export class Command {
    public _roles: string[];

    public _category?: string;

    constructor() {
        this._roles = [];
    }

    public execute(name: string, args: string[], message: Message) {

    }
}
