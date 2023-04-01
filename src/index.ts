require("dotenv").config();

import { Client, Events, GatewayIntentBits } from "discord.js";
import { checkActivity, checkMissingEnvVars, log } from "./helpers";
import ms from "ms";
import { connect } from "mongoose";
import { bold, green, red } from "colorette";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

// Check for missing environment variables
const missingEnvVars = checkMissingEnvVars();
if (missingEnvVars.length) {
  log(red(`Missing environment variables: ${missingEnvVars.join(", ")}`));
  process.exit(1);
}

client.once(Events.ClientReady, async (c) => {
  console.log("Started");
  log(green("Ready! Logged in as " + bold(c.user.tag)));

  // Connect to mongodb database
  try {
    await connect(process.env.MONGODB_URI);
    log(green("Connected to database!"));
  } catch (error) {
    log(red("Error while connecting to database!"), error);
    process.exit(1);
  }

  await checkActivity(client);
  setInterval(async () => await checkActivity(client), ms("1m"));
});

client.login(process.env.CLIENT_TOKEN);
