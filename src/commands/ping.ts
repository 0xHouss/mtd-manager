import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong !');
  }
};
