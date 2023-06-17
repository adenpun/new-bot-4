import {
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import type { NewBotClient } from "../client";
import { Command } from "../command";
import { POLL } from "./db";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Poll utilities.",
      name: "poll",
      async action(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
          case "create": {
            const title = interaction.options.getString("title");
            const options = interaction.options
              .getString("options")
              ?.split(",");

            if (title === null) throw "No title is provided.";
            if (typeof options === "undefined") throw "No options is provided.";

            await interaction.deferReply();

            const fields: APIEmbedField[] = options.map((v) => ({
              name: v,
              value: "0",
              inline: true,
            }));

            const buttons = options.map((v) =>
              new ButtonBuilder()
                .setCustomId(v.split(" ").join("_"))
                .setLabel(v)
                .setStyle(ButtonStyle.Danger)
            );

            const row =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                buttons
              );

            const message = await interaction.channel?.send({
              embeds: [new EmbedBuilder().setTitle(title).addFields(fields)],
              components: [row],
            });

            if (typeof message === "undefined") throw undefined;

            POLL.create({
              messageId: message.id,
            });

            await interaction.editReply("Created the poll.");

            break;
          }
        }
      },
      extra(builder) {
        return builder.addSubcommand((subcommand) =>
          subcommand
            .setDescription("New poll.")
            .setName("create")
            .addStringOption((options) =>
              options
                .setDescription("Title.")
                .setName("title")
                .setRequired(true)
            )
            .addStringOption((options) =>
              options
                .setDescription('Options that is seperated by ",".')
                .setName("options")
                .setRequired(true)
            )
        );
      },
    })
  );
}
