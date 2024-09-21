import { ChatInputCommandInteraction, EmbedBuilder, NewsChannel, PermissionsBitField, SlashCommandBuilder, TextChannel, ThreadChannel } from 'discord.js';

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
        if (interaction.member?.permissions instanceof PermissionsBitField) {
            const hasPermission = interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages);

            if (!hasPermission) return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("You can't use this command !")
                    .setColor("Red")
                ], ephemeral: true
            })
        } else return await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("You can't use this command !")
                .setColor("Red")
            ], ephemeral: true
        })

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
                return await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Cleared ${amount} messages !`)
                        .setColor("Green")
                    ], ephemeral: true
                });
            } else {
                return await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Cleared all messages in this channel !`)
                        .setColor("Green")
                    ], ephemeral: true
                });
            }
        } else return await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle('This command can only be used in text-based channels !')
                .setColor("Red")
            ], ephemeral: true
        });
    }
};
