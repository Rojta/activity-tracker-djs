import { blue, bold, dim, green, red, yellow } from "colorette";
import { Client } from "discord.js";
import activity from "./models/activity";

export function log(...args: any[]) {
  console.log(dim(`[${new Date().toLocaleString()}]`), ...args);
}

export function checkMissingEnvVars() {
  const envVars = [
    "CLIENT_TOKEN",
    "GUILD_ID",
    "USER_ID",
    "APPLICATION_NAME",
    "MONGODB_URI",
  ];
  const missingEnvVars: string[] = [];
  envVars.forEach((envVar) => {
    if (!process.env[envVar]) missingEnvVars.push(envVar);
  });
  return missingEnvVars;
}

export async function checkActivity(client: Client): Promise<void> {
  log(blue("Checking activity..."));

  try {
    // Check if guild exists
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return log(yellow("Guild not found!"));

    // Check if member exists
    const member = guild.members.cache.get(process.env.USER_ID);
    if (!member) return log(yellow("Member not found!"));

    // Get last activity
    const lastActivity = await activity.findOne().sort({ _id: -1 });

    // Get activity for specified application name
    const foundActivity = member.presence?.activities?.find(
      (a) => a.name === process.env.APPLICATION_NAME
    );

    // Check if member has presence and activity
    if (
      !member.presence ||
      member.presence?.status === "offline" ||
      !member.presence?.activities?.length
    ) {
      log(
        yellow(`${bold(member.user.tag)} is offline or not playing anything.`)
      );
      return await endlastActivity();
    }

    // Check if activity exists
    if (!foundActivity) {
      log(
        yellow(
          `${bold(member.user.tag)} is not playing specified application id.`
        )
      );

      log(
        yellow(
          `${bold(
            member.user.tag
          )} is currently playing: ${member.presence.activities
            .map((a) => a.name)
            .join(", ")}`
        )
      );

      return await endlastActivity();
    }

    if (
      lastActivity &&
      lastActivity.timestamps.created === foundActivity.createdTimestamp
    )
      return log(yellow("Activity already logged!"));

    await endlastActivity();

    // Create new activity
    const newActivity = new activity({
      userId: member.user.id,
      name: foundActivity.name,
      type: foundActivity.type,
      url: foundActivity.url,
      details: foundActivity.details,
      state: foundActivity.state,
      applicationId: foundActivity.applicationId,
      party: {
        id: foundActivity.party?.id,
        size: {
          current: foundActivity.party?.size[0],
          max: foundActivity.party?.size[1],
        },
      },
      assets: {
        largeImageUrl: foundActivity.assets?.largeImageURL(),
        largeImageId: foundActivity.assets?.largeImage,
        largeText: foundActivity.assets?.largeText,
        smallImageUrl: foundActivity.assets?.smallImageURL(),
        smallImageId: foundActivity.assets?.smallImage,
        smallText: foundActivity.assets?.smallText,
      },
      buttons: foundActivity.buttons,
      timestamps: {
        created: foundActivity.createdTimestamp,
        start: foundActivity.timestamps?.start,
        end: foundActivity.timestamps?.end,
      },
    });

    // Save new activity
    await newActivity.save();

    log(green("New activity logged!"));
  } catch (error) {
    log(red("Error while checking activity!"), error);
  }
}

export async function endlastActivity() {
  // Get last activity
  const lastActivity = await activity.findOne().sort({ _id: -1 });

  // Check if last activity exists
  if (!lastActivity) return;

  // Check if last activity is already ended
  if (lastActivity.timestamps.ended) return;

  // End last activity
  lastActivity.timestamps.ended = Date.now();
  await lastActivity.save();

  log(green("Last activity ended!"));
}
