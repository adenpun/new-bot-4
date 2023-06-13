import { ChannelType, type VoiceState } from "discord.js";
import type { NewBotClient } from "../client";
import { Command } from "../command";
import { UVCI_MODEL, UVC_MODEL } from "../db";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Create user-voice-channel's creator",
      name: "create-uvc-creator",
      async action(interaction) {
        const channel = interaction.options.getChannel("channel");
        if (channel !== null && channel.type === ChannelType.GuildVoice) {
          try {
            await UVC_MODEL.create({
              id: channel.id,
            });
          } catch {
            await interaction.reply("Something went wrong :/");
            return;
          }
          await interaction.reply("Command ran successfully!");
        }
      },
      extra(builder) {
        return builder.addChannelOption((v) =>
          v.setName("channel").setDescription("channel").setRequired(true)
        );
      },
    })
  );
}

export async function onVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState
) {
  const isUVC = newState.channelId
    ? (await UVC_MODEL.findOne({
        where: {
          id: newState.channelId,
        },
      })) !== null
    : false;
  const isUVCI = oldState.channelId
    ? (await UVCI_MODEL.findOne({
        where: {
          id: oldState.channelId,
        },
      })) !== null
    : false;

  if (isUVC) {
    const uvci = await newState.channel?.parent?.children.create({
      name: `${newState.member?.displayName ?? "User"}'s VC`,
      type: ChannelType.GuildVoice,
    });

    if (uvci?.id) {
      newState.member?.voice.setChannel(uvci);
      UVCI_MODEL.create({ id: uvci.id });
    }
  }

  if (isUVCI) {
    if ((oldState.channel?.members.size ?? 0) <= 0) {
      oldState.channel?.delete();
      await UVCI_MODEL.destroy({
        where: { id: oldState.channelId ?? undefined },
      });
    }
  }

  return;
}
