import { ChatInputCommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { startBrowser } from '../lib/puppeteer';

export default {
    data: new SlashCommandBuilder()
        .setName('black-to-white')
        .setDescription('Get the white amount of money to receive')
        .addIntegerOption(option =>
            option
                .setName('black-amount')
                .setDescription('The amount in black')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const blackAmount = interaction.options.getInteger('black-amount')!

        await interaction.deferReply({ ephemeral: true })

        const { browser, page } = await startBrowser()

        await page.goto("http://www.forexalgerie.com")

        const blackPrice = await page.evaluate(() => +document.querySelector<HTMLTableCellElement>("#eurBuy")?.innerText!)

        await page.goto("https://fcsapi.com/converter/eur/dzd")

        const whitePrice = Math.floor(await page.evaluate(() => +document.querySelector<HTMLSpanElement>(".converterresult-toAmount")?.innerText!))

        console.log(blackPrice, whitePrice);

        const whiteAmount = blackAmount * blackPrice / whitePrice

        const embed = new EmbedBuilder()
            .setTitle("Black to White Convertor")
            .setDescription(`To receive ${blackAmount}€ in black you need to receive ${Math.floor(whiteAmount)}€ in white`)
            .addFields(
                { name: "White Price of 1€:", value: whitePrice+' DZD', inline: true },
                { name: "Black Price of 1€:", value: blackPrice+' DZD', inline: true }
            )
            .setColor("Blue")

        await interaction.editReply({ embeds: [embed] })

        await browser.close()
    }
};
