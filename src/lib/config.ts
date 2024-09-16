import { z } from 'zod';
import configFile from "../../config.json";

const configSchema = z.object({
    TOKEN: z.string({ required_error: "TOKEN is required !" }).min(1, "TOKEN is required !"),
    GUILD_ID: z.string({ required_error: "GUILD_ID is required !" }).min(1, "GUILD_ID is required !"),
    CLIENT_ID: z.string({ required_error: "CLIENT_ID is required !" }).min(1, "CLIENT_ID is required !"),
})

const config = configSchema.parse(configFile)

export default config