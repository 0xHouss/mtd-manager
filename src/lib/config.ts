import { z } from 'zod';
import configFile from "../../config.json";

const configSchema = z.object({
    // Bot
    TOKEN: z.string({ required_error: "TOKEN is required !" }).min(1, "TOKEN is required !"),
    GUILD_ID: z.string({ required_error: "GUILD_ID is required !" }).min(1, "GUILD_ID is required !"),
    CLIENT_ID: z.string({ required_error: "CLIENT_ID is required !" }).min(1, "CLIENT_ID is required !"),

    // Puppeteer
    HEADLESS: z
        .union([
            z.literal("shell"),
            z.literal(false),
            z.literal("false").transform(_ => false)
        ]),
    NO_SANDBOX: z
        .union([
            z.boolean(),
            z.string().toLowerCase().transform(arg => arg === "true")
        ]),
})

const config = configSchema.parse(configFile)

export default config