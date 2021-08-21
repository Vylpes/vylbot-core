import { Command } from "../../../src/type/command";

export class roles extends Command {
    constructor() {
        super();
        this._roles = [ "Moderator" ];
    }
}