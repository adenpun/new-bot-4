import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

export interface ClientConfig {
    appId: string;
    token: string;
}

export interface CommandConfig {
    description: string;
    name: string;
    action?: (interaction: ChatInputCommandInteraction) => void;
    extra?: (builder: SlashCommandBuilder) => AnySlashCommandBuilder;
}

export type AnySlashCommandBuilder =
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
