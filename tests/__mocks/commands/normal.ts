import { Command } from "../../../src/type/command";

export class normal extends Command {
    constructor() {
        super();
        this._category = "General";
    }
}