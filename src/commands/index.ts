import { Locale } from "discord.js";
import { NewBotClient } from "../client";
import { Command } from "../command";
import { addCommands as addPollCommands } from "../poll";
import { addCommands as addUvcCommands } from "../uvc";
// import { addCommands as addDatabaseCommands } from "../db";
// import { addCommands as addGreetingsCommands } from "../greetings";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Get some help.",
      name: "help",
      async action(interaction) {
        if (
          interaction.locale === Locale.ChineseCN ||
          interaction.locale === Locale.ChineseTW
        )
          await interaction.reply("正在維修...");
        else await interaction.reply("Fixing things...");
      },
    })
  );
  bot.commands.push(
    new Command({
      description: "Send a message!",
      name: "say",
      async action(interaction) {
        const message = interaction.options.getString("message");

        if (message === null) throw "Message is not provided.";

        await interaction.deferReply({ ephemeral: true });

        const msg = await interaction.channel?.send(message);
        await interaction.editReply({
          content: `Sent! URL: ${msg?.url}`,
        });
      },
      extra(builder) {
        return builder.addStringOption((v) =>
          v
            .setDescription("The message to be sent.")
            .setName("message")
            .setRequired(true)
        );
      },
    })
  );
  bot.commands.push(
    new Command({
      description: "Discord's avatar utilities.",
      name: "avatar",
      async action(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
          case "get": {
            const user = interaction.options.getUser("user");
            const url = user?.avatarURL({ size: 4096 });
            if (url) interaction.reply(url);
            break;
          }
        }
      },
      extra(builder) {
        return builder.addSubcommand((v) =>
          v
            .setDescription("Get user's avatar.")
            .setName("get")
            .addUserOption((v) =>
              v.setDescription("The user.").setName("user").setRequired(true)
            )
        );
      },
    })
  );

  // addDatabaseCommands(bot);
  // addGreetingsCommands(bot);
  addPollCommands(bot);
  addUvcCommands(bot);
}
