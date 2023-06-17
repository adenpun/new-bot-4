import { DataTypes, Model } from "sequelize";
import { db } from "../db";

interface PollModel {
  messageId: string;
}

interface VoteModel {
  userId: string;
  option: number;
  pollMessageId: number;
}

export const POLL = db.define<Model<PollModel>>("poll", {
  messageId: { primaryKey: true, type: DataTypes.STRING, unique: true },
});

export const VOTE = db.define<Model<VoteModel>>("vote", {
  userId: { type: DataTypes.STRING },
  option: DataTypes.INTEGER,
  pollMessageId: DataTypes.STRING,
});

POLL.hasMany(VOTE);
VOTE.belongsTo(POLL);
