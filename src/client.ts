import {
  CacheType,
  Client,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  VoiceState,
} from "discord.js";
import type { Command } from "./command";
import type { ClientConfig } from "./types";
import { onVoiceStateUpdate as UvcOnVoiceStateUpdate } from "./uvc";
import { GUILD } from "./db";

export class NewBotClient {
  public client: Client;
  public commands: Command[] = [];

  private config: ClientConfig;

  public constructor(config: ClientConfig) {
    this.client = new Client({
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates,
    });
    this.config = config;
    this.client.on("interactionCreate", this.onInteractionCreate.bind(this));
    this.client.on("voiceStateUpdate", this.onVoiceStateUpdate.bind(this));

    return this;
  }

  public async registerCommands(): Promise<void> {
    const rest = new REST().setToken(this.config.token);
    await rest.put(Routes.applicationCommands(this.config.appId), {
      body: this.commands.map((v) => v.toJSON()),
    });

    return;
  }

  public async start(): Promise<void> {
    await this.client.login(this.config.token);
    this.client.guilds.cache.forEach((guild) => {
      // GUILD.findOrCreate({
      //   where: {
      //     id: guild.id,
      //   },
      //   defaults: {
      //     id: guild.id,
      //   },
      // });
    });
  }

  private async onInteractionCreate(interaction: Interaction<CacheType>) {
    if (interaction.isChatInputCommand()) {
      const action = this.commands.find((v) => {
        return interaction.commandName === v.config.name;
      })?.config.action;
      try {
        if (action) await action(interaction);
      } catch (err) {
        const reply = JSON.stringify(err) ?? "Something went wrong :/";
        if (interaction.replied) await interaction.editReply(reply);
        else await interaction.reply(reply);
      }
    }
    return;
  }

  private async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    await UvcOnVoiceStateUpdate(oldState, newState);

    return;
  }
}
