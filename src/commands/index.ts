import { NewBotClient } from "../client";
import { Command } from "../command";
import { addCommands as addUvcCommands } from "../uvc";
// import { addCommands as addLockdownCommands } from "../lockdown";

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

  // addLockdownCommands(bot);
  addUvcCommands(bot);
}
