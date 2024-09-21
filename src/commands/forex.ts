import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { Page } from 'puppeteer';
import { createPage, startBrowser } from '../lib/puppeteer';

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

        const { browser, page: blackPage } = await startBrowser()

        const [eurWhitePage, gbpWhitePage] = await Promise.all([createPage(browser), createPage(browser)])

        async function getBlack(page: Page) {
            await page.goto("http://www.forexalgerie.com")

            return await page.evaluate(() => {
                return {
                    eurBlack: +document.querySelector<HTMLTableCellElement>("#eurBuy")?.innerText!,
                    gbpBlack: +document.querySelector<HTMLTableCellElement>("#gbpBuy")?.innerText!
                }
            })
        }

        async function getWhite(page: Page, currency: string) {
            await page.goto(`https://fcsapi.com/converter/${currency}/dzd`)

            return Math.floor(await page.evaluate(() => +document.querySelector<HTMLSpanElement>(".converterresult-toAmount")?.innerText!))
        }

        const [{ eurBlack, gbpBlack }, eurWhite, gbpWhite] = await Promise.all([getBlack(blackPage), getWhite(eurWhitePage, "eur"), getWhite(gbpWhitePage, "gbp")])

        const embed = new EmbedBuilder()
            .setTitle("Forex Prices")
            .setDescription(`
                EUR: ⬜ ${eurWhite} DZD ⬜ ⬛ ${eurBlack} DZD ⬛
                GBP: ⬜ ${gbpWhite} DZD ⬜ ⬛ ${gbpBlack} DZD ⬛ 
            `)
            .setColor("Blue")

        await interaction.editReply({ embeds: [embed] })

        await browser.close()
    }
};
