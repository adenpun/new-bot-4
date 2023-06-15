import { USER_VC_CREATOR } from "./db";

export async function enableUserVoiceChannelCreator({
  guildId,
  id,
}: {
  guildId: string;
  id: string;
}) {
  await USER_VC_CREATOR.create({
    guildId,
    id,
  });
}

export async function disableUserVoiceChannelCreator({
  guildId,
  id,
}: {
  guildId: string;
  id: string;
}) {
  await USER_VC_CREATOR.destroy({
    where: {
      guildId,
      id,
    },
  });
}
