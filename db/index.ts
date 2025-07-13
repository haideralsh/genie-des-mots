import Database from "better-sqlite3";
import path from "path";

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database.Database;

  private constructor() {
    const filePath = path.join(process.cwd(), "db/words.sqlite");
    this.db = new Database(filePath, {
      fileMustExist: true,
      readonly: true,
    });

    this.db.pragma("synchronous = NORMAL");
    this.db.pragma("cache_size = 10000");
    this.db.pragma("temp_store = memory");
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }
}

export default DatabaseManager.getInstance().getDatabase();

process.on("SIGINT", () => {
  DatabaseManager.getInstance().close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  DatabaseManager.getInstance().close();
  process.exit(0);
});
