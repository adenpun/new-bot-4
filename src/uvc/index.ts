import { ChannelType, Guild, VoiceState } from "discord.js";
import type { NewBotClient } from "../client";
import { Command } from "../command";
import { UVC, UVCC } from "../db";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Enable user-voice-channel's creator",
      name: "enable-uvc-creator",
      async action(interaction) {
        const channel = interaction.options.getChannel("channel");
        if (
          channel !== null &&
          channel.type === ChannelType.GuildVoice &&
          interaction.guildId
        ) {
          await UVCC.create({
            guildId: interaction.guildId,
            id: channel.id,
          });
          await interaction.reply("Command ran successfully!");
        }
      },
      extra(builder) {
        return builder
          .addChannelOption((v) =>
            v.setName("channel").setDescription("channel").setRequired(true)
          )
          .setDefaultMemberPermissions(0);
      },
    })
  );

  bot.commands.push(
    new Command({
      description: "Disable user-voice-channel's creator",
      name: "disable-uvc-creator",
      async action(interaction) {
        const channel = interaction.options.getChannel("channel");
        if (
          channel !== null &&
          channel.type === ChannelType.GuildVoice &&
          interaction.guildId
        ) {
          try {
            await UVCC.destroy({
              where: {
                guildId: interaction.guildId,
                id: channel.id,
              },
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
  const isJoiningUVCC = newState.channelId
    ? (await UVCC.findOne({
        where: {
          id: newState.channelId,
        },
      })) !== null
    : false;
  const isLeavingUVC = oldState.channelId
    ? (await UVC.findOne({
        where: {
          id: oldState.channelId,
        },
      })) !== null
    : false;

  if (isJoiningUVCC) {
    const uvc = await newState.channel?.parent?.children.create({
      name: `${newState.member?.displayName ?? "User"}'s VC`,
      type: ChannelType.GuildVoice,
    });
    if (!uvc?.id) return;
    newState.member?.voice.setChannel(uvc);
    if (!newState.channelId) return;
    UVC.create({ id: uvc.id, uvccId: newState.channelId });
  }

  if (isLeavingUVC) {
    if ((oldState.channel?.members.size ?? 0) <= 0) {
      oldState.channel?.delete();
      await UVC.destroy({
        where: { id: oldState.channelId ?? undefined },
      });
    }
  }

  return;
}
