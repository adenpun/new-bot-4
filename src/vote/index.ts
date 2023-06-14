import type { NewBotClient } from "../client";
import { Command } from "../command";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Vote utilities.",
      name: "vote",
      async action(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
          case "new":
            throw "";
            break;
        }
      },
      extra(builder) {
        return builder.addSubcommand((v) =>
          v.setDescription("New vote.").setName("new")
        );
      },
    })
  );
}
