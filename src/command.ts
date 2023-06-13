import { SlashCommandBuilder } from "discord.js";
import type { AnySlashCommandBuilder, CommandConfig } from "./types";

export class Command {
    public config: CommandConfig;

    public constructor(config: CommandConfig) {
        this.config = config;
    }

    public toBuilder(): AnySlashCommandBuilder {
        const builder = new SlashCommandBuilder()
            .setName(this.config.name)
            .setDescription(this.config.description);
        return this.config.extra?.(builder) ?? builder;
    }

    public toJSON() {
        return this.toBuilder().toJSON();
    }
}
