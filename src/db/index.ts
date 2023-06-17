import { DataTypes, Model, Sequelize } from "sequelize";
import { NewBotClient } from "../client";
import { Command } from "../command";

export function addCommands(bot: NewBotClient) {
  bot.commands.push(
    new Command({
      description: "Database utilities.",
      name: "database",
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

import "../greetings/db";
import "../poll/db";
import "../uvc/db";
