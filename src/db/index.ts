import { DataTypes, Model, Sequelize } from "sequelize";
import { NewBotClient } from "../client";
import { Command } from "../command";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Database utilities.",
      name: "database",
      async action(interaction) {
        const a = await GUILD.findAll({
          include: [UVCC],
        });
        interaction.reply(JSON.stringify(a));
        // throw undefined;
      },
      extra(builder) {
        return builder
          .addSubcommand((v) =>
            v.setDescription("Get database.").setName("get")
          )
          .setDefaultMemberPermissions(0);
      },
    })
  );
}

export const db = new Sequelize("database", "admin", "admin", {
  host: "localhost",
  dialect: "sqlite",
  storage: "sqlite.db",
  logging: process.env.LOGGING === "true" ? console.log : false,
});

export type ChannelModel = {
  id: string;
};

export type LockdownModel = {
  channelsAffected: string;
  guildId: string;
  originalPerm: string;
};

export type GuildModel = {
  id: string;
};

export const GUILD = db.define<Model<GuildModel>>("guild", {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  },
});

export const UVCC = db.define<Model<ChannelModel & { guildId: string }>>(
  "uvcc",
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
    guildId: DataTypes.STRING,
  }
);

export const UVC = db.define<Model<ChannelModel & { uvccId: string }>>("uvc", {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  },
  uvccId: DataTypes.STRING,
});

GUILD.hasMany(UVCC);
UVCC.belongsTo(GUILD);

UVCC.hasMany(UVC);
UVC.belongsTo(UVCC);
