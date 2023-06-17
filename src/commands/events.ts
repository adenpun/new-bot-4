import { CacheType, Interaction } from "discord.js";
import { NewBotClient } from "../client";

export async function onInteractionCreate(
  this: NewBotClient,
  interaction: Interaction<CacheType>
) {
  if (!interaction.isChatInputCommand()) return;

  const action = this.commands.find((v) => {
    return interaction.commandName === v.config.name;
  })?.config.action;
  try {
    if (action) await action(interaction);
  } catch (err) {
    const reply = JSON.stringify(err) ?? "Something went wrong :/";
    if (interaction.deferred || interaction.replied)
      await interaction.editReply(reply);
    else await interaction.reply(reply);
  }
}
