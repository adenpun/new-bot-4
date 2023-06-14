import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface ClientConfig {
  appId: string;
  token: string;
}

export interface CommandConfig {
  description: string;
  name: string;
  action?: (interaction: ChatInputCommandInteraction) => Promise<void>;
  extra?: (builder: SlashCommandBuilder) => AnySlashCommandBuilder;
}

export type AnySlashCommandBuilder =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | SlashCommandSubcommandsOnlyBuilder;
