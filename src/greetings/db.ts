import { DataTypes, Model } from "sequelize";
import { ChannelModel, GUILD, db } from "../db";

export const GREETINGS_CHANNEL = db.define<
  Model<ChannelModel & { guildId: string }>
>("gc", {
  guildId: DataTypes.STRING,
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  },
});

GUILD.hasOne(GREETINGS_CHANNEL);
GREETINGS_CHANNEL.belongsTo(GUILD);
