import "@total-typescript/ts-reset";
import { ActivityType } from "discord.js";
import "dotenv/config";
import { NewBotClient } from "./client";
import { addCommands } from "./commands";
import { db } from "./db";

async function main() {
    if (!(process.env.DISCORD_TOKEN && process.env.CLIENT_ID)) return;

    const bot = new NewBotClient({
        appId: process.env.CLIENT_ID,
        token: process.env.DISCORD_TOKEN,
    });

    addCommands(bot);
    await db.sync();
    await bot.registerCommands();

    await bot.start();
    bot.client.user?.setPresence({
        activities: [
            {
                name: "a lot of code.",
                type: ActivityType.Watching,
            },
        ],
        status: "online",
    });

    console.log(`Logged in as ${bot.client.user?.tag}`);
}

main();
