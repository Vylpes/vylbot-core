// Required Components
import { Client, Message } from "discord.js";
import { readdirSync, existsSync } from "fs";
import { IBaseResponse } from "../contracts/IBaseResponse";
import { Command } from "../type/command";
import { Event } from "../type/event";

export interface IUtilResponse extends IBaseResponse {
    context?: {
        name: string;
        args: string[];
        message: Message;
    }
}

// Util Class
export class Util {
    public loadCommand(name: string, args: string[], message: Message): IUtilResponse {
        if (!message.member) return {
            valid: false,
            message: "Member is not part of member",
        };

        const folder = process.env.FOLDERS_COMMANDS;

        if (existsSync(`${process.cwd()}/${folder}/`)) {
            if (existsSync(`${process.cwd()}/${folder}/${name}.ts`)) {
                const commandFile = require(`${process.cwd()}/${folder}/${name}.ts`);
                const command = new commandFile[name]() as Command;
    
                const requiredRoles = command._roles;

                if (!command._category) command._category = "none";
    
                for (const i in requiredRoles) {
                    if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                        message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);

                        return {
                            valid: false,
                            message: `You require the \`${requiredRoles[i]}\` role to run this command`,
                        };
                    }
                }
    
                // Run the command and pass the command context with it
                command.execute(name, args, message);

                return {
                    valid: true,
                    context: {
                        name: name,
                        args: args,
                        message: message,
                    }
                }
            } else {
                return {
                    valid: false,
                    message: "File does not exist",
                }
            }
        } else {
            return {
                valid: false,
                message: "Comamnd folder does not exist",
            }
        }
    }

    // Load the events
    loadEvents(client: Client): IUtilResponse {
        // Get the current folder to check
        const folder = process.env.FOLDERS_EVENTS;

        // If the folder exists
        if (existsSync(`${process.cwd()}/${folder}/`)) {
            // Get the files inside of this folder
            const eventFiles = readdirSync(`${process.cwd()}/${folder}/`);

            // Loop through all the files in the folder
            for (let i = 0; i < eventFiles.length; i++) {
                // Ignore non-javascript files
                if (eventFiles[i].includes('.ts')) {
                    // Get the event name, by taking the command file and removing the ".ts" from the end
                    const eventName = eventFiles[i].split('.')[0];

                    // Get the file of the event
                    const file = require(`${process.cwd()}/${folder}/${eventName}.ts`);

                    // Initialise the event class
                    const event = new file() as Event;

                    // Set the client to emit to this event
                    client.on(eventName, event.execute);
                }
            }

            return {
                valid: true,
            }
        } else {
            return {
                valid: false,
                message: "Event folder does not exist",
            }
        }
    }
}
