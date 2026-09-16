import { MongoClient, Db } from 'mongodb';

function getMongoUri(): string {
  const raw = (process.env.MONGODB_URI || process.env.MONGOURL || "").trim();

  // Auto-fix common typo: mmongodb:// -> mongodb://
  const fixed = raw.replace(/^mmongodb:\/\//i, "mongodb://");

  return fixed;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let lastPingTime = 0;
const PING_INTERVAL_MS = 30_000; // Only ping every 30s instead of every request

export async function connectToDB() {
  // Always read env fresh (Next.js hot-reload doesn't re-evaluate module-level consts)
  const MONGODB_URI = getMongoUri();

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI or MONGOURL environment variable inside .env.local');
  }

  if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
    throw new Error(
      `Invalid MONGODB_URI or MONGOURL. Expected connection string starting with "mongodb://" or "mongodb+srv://". Got: "${MONGODB_URI.slice(0, 50)}..."`
    );
  }

  // If we have a cached connection, only verify it's alive periodically (not every request)
  if (cachedClient && cachedDb) {
    const now = Date.now();
    if (now - lastPingTime < PING_INTERVAL_MS) {
      // Skip ping — trust the cached connection (saves a round-trip per request)
      return { client: cachedClient, db: cachedDb };
    }

    try {
      await cachedDb.admin().ping();
      lastPingTime = now;
      return { client: cachedClient, db: cachedDb };
    } catch {
      // Connection is dead — clear cache and reconnect below
      try {
        await cachedClient.close();
      } catch {
        // ignore close errors
      }
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    const db = client.db();

    // Verify connection with a ping
    await db.admin().ping();
    lastPingTime = Date.now();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    // Clear any partial state
    try {
      await client.close();
    } catch {
      // ignore
    }
    cachedClient = null;
    cachedDb = null;

    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Database connection failed: ${errMsg}`);
    console.error(`Using MONGOURL/MONGODB_URI: ${MONGODB_URI.replace(/:([^@:]+)@/, ':****@')}`);
    throw error;
  }
}

export async function disconnectFromDB() {
  if (cachedClient) {
    try {
      await cachedClient.close();
    } catch {
      // ignore
    }
    cachedClient = null;
    cachedDb = null;
  }
}
