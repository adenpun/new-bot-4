import { ChannelType } from "discord.js";
import type { NewBotClient } from "../client";
import { Command } from "../command";
import {
  disableUserVoiceChannelCreator,
  enableUserVoiceChannelCreator,
} from "./utils";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "User VC utilities.",
      name: "user-vc",
      async action(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        switch (subcommandGroup) {
          case "creator": {
            switch (subcommand) {
              case "disable": {
                const channel = interaction.options.getChannel("channel");

                if (channel === null) throw "Channel is not provided.";
                if (channel.type !== ChannelType.GuildVoice)
                  throw "Channel is not a voice channel.";
                if (interaction.guildId === null)
                  throw "Guild id is not provided";

                await disableUserVoiceChannelCreator({
                  guildId: interaction.guildId,
                  id: channel.id,
                });
                await interaction.reply("Disabled the user VC creator.");

                break;
              }
              case "enable": {
                const channel = interaction.options.getChannel("channel");

                if (channel === null) throw "Channel is not provided.";
                if (channel.type !== ChannelType.GuildVoice)
                  throw "Channel is not a voice channel.";
                if (interaction.guildId === null)
                  throw "Guild id is not provided";

                await enableUserVoiceChannelCreator({
                  guildId: interaction.guildId,
                  id: channel.id,
                });
                await interaction.reply("Enabled the user VC creator.");

                break;
              }
            }
            break;
          }
        }
      },
      extra(builder) {
        return builder.addSubcommandGroup((subcommandGroup) =>
          subcommandGroup
            .setDescription("User VC creator")
            .setName("creator")
            .addSubcommand((subcommand) =>
              subcommand
                .setDescription("Disable a user VC creator.")
                .setName("disable")
                .addChannelOption((option) =>
                  option
                    .setDescription("Channel.")
                    .setName("channel")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
              subcommand
                .setDescription("Enable a user VC creator.")
                .setName("enable")
                .addChannelOption((option) =>
                  option
                    .setDescription("Channel.")
                    .setName("channel")
                    .setRequired(true)
                )
            )
        );
      },
    })
  );
}
