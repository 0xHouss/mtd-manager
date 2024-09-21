import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { startBrowser } from '../lib/puppeteer';

export default {
    data: new SlashCommandBuilder()
        .setName('forex')
        .setDescription('Get the currency prices'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.member?.permissions instanceof PermissionsBitField) {
            const hasPermission = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

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

        await interaction.deferReply({ ephemeral: true })

        const { browser, page } = await startBrowser()

        await page.goto("http://www.forexalgerie.com")

        const eurBlack = await page.evaluate(() => +document.querySelector<HTMLTableCellElement>("#eurBuy")?.innerText!)
        const gbpBlack = await page.evaluate(() => +document.querySelector<HTMLTableCellElement>("#gbpBuy")?.innerText!)

        await page.goto("https://fcsapi.com/converter/eur/dzd")

        const eurWhite = Math.floor(await page.evaluate(() => +document.querySelector<HTMLSpanElement>(".converterresult-toAmount")?.innerText!))

        await page.goto("https://fcsapi.com/converter/gbp/dzd")

        const gbpWhite = Math.floor(await page.evaluate(() => +document.querySelector<HTMLSpanElement>(".converterresult-toAmount")?.innerText!))

        const embed = new EmbedBuilder()
            .setTitle("Forex Prices")
            .addFields(
                { name: "White Price of 1€:", value: eurWhite + ' DZD', inline: true },
                { name: "Black Price of 1€:", value: eurBlack + ' DZD', inline: true },
                { name: "White Price of 1£:", value: gbpWhite + ' DZD', inline: false },
                { name: "Black Price of 1£:", value: gbpBlack + ' DZD', inline: true },
            )
            .setColor("Blue")

        await interaction.editReply({ embeds: [embed] })

        await browser.close()
    }
};
