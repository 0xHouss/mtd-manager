import { ChatInputCommandInteraction, NewsChannel, SlashCommandBuilder, TextChannel, ThreadChannel } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the channel.')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to clear (defaults to all)')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.channel || !interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server channel.', ephemeral: true });
      return;
    }

    // Check if the channel is a TextChannel, NewsChannel, or ThreadChannel
    if (interaction.channel instanceof TextChannel || interaction.channel instanceof NewsChannel || interaction.channel instanceof ThreadChannel) {
      const messages = await interaction.channel.messages.fetch({ limit: amount ?? 100 });
      await interaction.channel.bulkDelete(messages, true); // 'true' ignores messages older than 14 days

      if (amount) {
        await interaction.reply({ content: `Cleared ${amount} messages.`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'Cleared all messages in the channel.', ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'This command can only be used in text-based channels.', ephemeral: true });
    }
  }
};
