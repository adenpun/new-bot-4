import { DataTypes, Model } from "sequelize";
import { ChannelModel, GUILD, db } from "../db";

export const USER_VC_CREATOR = db.define<
  Model<ChannelModel & { guildId: string }>
>("uvcc", {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  },
  guildId: DataTypes.STRING,
});

export const USER_VC = db.define<Model<ChannelModel & { uvccId: string }>>(
  "uvc",
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
    uvccId: DataTypes.STRING,
  }
);

GUILD.hasMany(USER_VC_CREATOR);
USER_VC_CREATOR.belongsTo(GUILD);

USER_VC_CREATOR.hasMany(USER_VC);
USER_VC.belongsTo(USER_VC_CREATOR);
