import { ChannelType, VoiceState } from "discord.js";
import { USER_VC, USER_VC_CREATOR } from "./db";

export async function onVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState
) {
  const isJoiningUVCC = newState.channelId
    ? (await USER_VC_CREATOR.findOne({
        where: {
          id: newState.channelId,
        },
      })) !== null
    : false;
  const isLeavingUVC = oldState.channelId
    ? (await USER_VC.findOne({
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
    USER_VC.create({ id: uvc.id, uvccId: newState.channelId });
  }

  if (isLeavingUVC) {
    if ((oldState.channel?.members.size ?? 0) <= 0) {
      oldState.channel?.delete();
      await USER_VC.destroy({
        where: { id: oldState.channelId ?? undefined },
      });
    }
  }

  return;
}
