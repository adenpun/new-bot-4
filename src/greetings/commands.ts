import type { NewBotClient } from "../client";
import { Command } from "../command";
import { GREETINGS_CHANNEL } from "./db";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Greeting channel utilities.",
      name: "greeting-channel",
      async action(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
          case "enable": {
            const channel = interaction.options.getChannel("channel");

            if (channel === null) throw "Channel is not provided.";
            if (interaction.guildId === null) throw "Guild Id is not provided.";

            GREETINGS_CHANNEL.create({
              guildId: interaction.guildId,
              id: channel.id,
            });

            break;
          }
        }
      },
      extra(builder) {
        return builder.addSubcommand((subcommand) =>
          subcommand
            .setDescription("Enable.")
            .setName("enable")
            .addChannelOption((options) =>
              options
                .setDescription("Channel.")
                .setName("channel")
                .setRequired(true)
            )
        );
      },
    })
  );
}
