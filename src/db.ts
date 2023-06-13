import {
    Sequelize,
    DataTypes,
    Model,
    InferCreationAttributes,
    InferAttributes,
} from "sequelize";

export const db = new Sequelize("database", "admin", "admin", {
    host: "localhost",
    dialect: "sqlite",
    storage: "database.sqlite",
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

export const UVC_MODEL = db.define<Model<ChannelModel>>("uvc", {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
    },
});

export const UVCI_MODEL = db.define<Model<ChannelModel>>("uvci", {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
    },
});

export const LOCKDOWN_MODEL = db.define<Model<LockdownModel>>("lockdown", {
    channelsAffected: DataTypes.STRING,
    guildId: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
    },
    originalPerm: DataTypes.STRING,
});
