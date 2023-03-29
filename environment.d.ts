declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_TOKEN: string;
      GUILD_ID: string;
      USER_ID: string;
      APPLICATION_ID: string;
      GAMES_FILE_PATH: string;
    }
  }
}

export {};
