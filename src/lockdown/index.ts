import { Role } from "discord.js";
import type { NewBotClient } from "../client";
import { Command } from "../command";
import { LOCKDOWN_MODEL, type LockdownModel } from "../db";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Lockdown the server. (SUPER DANGEROUS)",
      name: "lockdown",
      async action(interaction) {
        if (!interaction.guildId || !interaction.guild) return;

        const role = interaction.options.getRole("for_role") as
          | Role
          | undefined;

        const lockdownModel: {
          channelsAffected: string[];
          guildId: string;
          originalPerm: (boolean | null)[];
        } = {
          channelsAffected: [],
          guildId: interaction.guildId,
          originalPerm: [],
        };
        const channels = await interaction.guild.channels.fetch();
        if (!channels) return;

        // Do the work
        channels.forEach((v) => {
          if (!v) return;
          const perm = v.permissionOverwrites.cache.get(
            role?.id ?? v.guild.roles.everyone.id
          );
          if (!perm) return;
          const isAllow = perm.allow.has("SendMessages");
          const isDeny = perm.deny.has("SendMessages");
          lockdownModel.channelsAffected.push(v.id);
          lockdownModel.originalPerm.push(
            isAllow ? true : isDeny ? false : null
          );
          v.permissionOverwrites.edit(role ?? v.guild.roles.everyone, {
            SendMessages: false,
          });
        });

        // Write db
        await LOCKDOWN_MODEL.destroy({
          where: { guildId: interaction.guildId },
        });

        LOCKDOWN_MODEL.create({
          channelsAffected: lockdownModel.channelsAffected.join(","),
          guildId: lockdownModel.guildId,
          originalPerm: lockdownModel.originalPerm.join(","),
        });

        await interaction.reply("Done.");
      },
      extra(i) {
        return i
          .setDefaultMemberPermissions(0)
          .addRoleOption((v) =>
            v.setName("for_role").setDescription("For role.")
          );
      },
    })
  );

  bot.commands.push(
    new Command({
      description: "Get Lockdown Data.",
      name: "get-lockdown",
      async action(interaction) {
        const a = await LOCKDOWN_MODEL.findOne({
          where: {
            guildId: interaction.guildId ?? "",
          },
        });

        await interaction.reply(JSON.stringify(a));
      },
      extra(i) {
        return i.setDefaultMemberPermissions(0);
      },
    })
  );

  bot.commands.push(
    new Command({
      description: "Un-lockdown the server.",
      name: "unlockdown",
      async action(interaction) {
        if (!interaction.guildId || !interaction.guild) return;

        const role = interaction.options.getRole("for_role") as Role;

        const lockdownData = (
          await LOCKDOWN_MODEL.findOne({
            where: {
              guildId: interaction.guildId,
            },
          })
        )?.toJSON();
        if (!lockdownData) return;
        const channels = await interaction.guild.channels.fetch();
        if (!channels) return;
        const channelsAf = lockdownData.channelsAffected.split(",") ?? [];
        const oriPerm =
          lockdownData.originalPerm
            .split(",")
            .map((v) => (v === "true" ? true : v === "false" ? false : null)) ??
          [];

        // Do stuff
        channels.forEach((v) => {
          if (!v) return;
          if (channelsAf.indexOf(v.id) !== -1) {
            v.permissionOverwrites.edit(role ?? v.guild.roles.everyone, {
              SendMessages: oriPerm[channelsAf.indexOf(v.id)],
            });
          }
        });

        await interaction.reply("Done.");
      },
      extra(i) {
        return i
          .setDefaultMemberPermissions(0)
          .addRoleOption((v) =>
            v.setName("for_role").setDescription("For role.")
          );
      },
    })
  );
}
