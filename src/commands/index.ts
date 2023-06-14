import { NewBotClient } from "../client";
import { Command } from "../command";
import { addCommands as addUvcCommands } from "../uvc";
import { addCommands as addDatabaseCommands } from "../db";
import { addCommands as addVoteCommands } from "../vote";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "get some help",
      name: "help",
      async action(interaction) {
        await interaction.reply("正在維修...（提供更好的體驗）");
      },
    })
  );
  bot.commands.push(
    new Command({
      description: "Send a message!",
      name: "say",
      async action(interaction) {
        const message = interaction.options.getString("message");
        if (message) {
          const msg = await interaction.channel?.send(message);
          await interaction.reply({
            content: `Sent! URL: ${msg?.url}`,
            ephemeral: true,
          });
        }
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
            const a = interaction.options.getUser("user");
            const url = a?.avatarURL({ size: 4096 });
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

  addDatabaseCommands(bot);
  addUvcCommands(bot);
  addVoteCommands(bot);
}
