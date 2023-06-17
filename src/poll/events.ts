import { CacheType, Interaction } from "discord.js";
import { NewBotClient } from "../client";

export async function onInteractionCreate(
  this: NewBotClient,
  interaction: Interaction<CacheType>
) {
  if (!interaction.isButton()) return;
  await interaction.reply(interaction.message.id);
  // interaction.componentType
}
