require("dotenv").config();

import { Client, Events, GatewayIntentBits } from "discord.js";
import { checkIfGamesFileExist, getGames, saveGames } from "./helpers";
import ms from "ms";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

client.once(Events.ClientReady, async (c) => {
  console.log("Started");
  console.log(`Ready! Logged in as ${c.user.tag}!`);

  const checkActivity = async () => {
    try {
      console.log("Checking activity...");
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      if (!guild) return console.log("Guild not found!");

      const member = guild.members.cache.get(process.env.USER_ID);
      if (!member) return console.log("Member not found!");

      if (member.presence.status === "offline")
        return console.log(`${member.user.tag} is offline.`);

      if (!member.presence?.activities?.length)
        return console.log(`${member.user.tag} is not playing anything.`);

      const activity = member.presence.activities.find(
        (a) => a.applicationId === process.env.APPLICATION_ID
      );
      if (!activity)
        return console.log(
          `${member.user.tag} is not playing League of Legends!`
        );

      let gamesFileCheck = await checkIfGamesFileExist(
        process.env.GAMES_FILE_PATH
      );
      if (!gamesFileCheck) return console.log("Games file not found!");
      let games = await getGames(process.env.GAMES_FILE_PATH);

      if (games[0]) {
        if (games[0].timestamps.start === activity.createdTimestamp)
          return console.log("Game already logged!");
        games[0].timestamps.end = Date.now();
      }

      games.unshift({
        id: games.length,
        type: activity.type,
        details: activity.details,
        state: activity.state,
        timestamps: {
          start: activity.createdTimestamp,
          end: null,
        },
      });

      const saveCheck = await saveGames(process.env.GAMES_FILE_PATH, games);
      if (!saveCheck) return console.log("Error while saving games!");
    } catch (error) {
      return console.log("Error while checking activity!", error);
    }
  };

  await checkActivity();
  setInterval(checkActivity, ms("1m"));
});

client.login(process.env.CLIENT_TOKEN);
