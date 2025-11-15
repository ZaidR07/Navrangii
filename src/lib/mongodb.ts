import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOURL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or MONGOURL environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI!);
  await client.connect();
  
  const db = client.db(); // Uses database name from connection string
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export async function disconnectFromDB() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
