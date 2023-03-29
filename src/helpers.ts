import { constants, access, readFile, writeFile } from "fs/promises";
import { Game } from "./types";

export async function checkIfGamesFileExist(
  filePath: string
): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getGames(filePath: string): Promise<Game[]> {
  try {
    const games = await readFile(filePath, "utf-8");
    return JSON.parse(games);
  } catch (error) {
    return [];
  }
}

export async function saveGames(filePath: string, games: Game[]) {
  try {
    await writeFile(filePath, JSON.stringify(games, null, 4), "utf-8");
    return true;
  } catch (error) {
    return false;
  }
}
