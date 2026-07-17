import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: { promise: Promise<typeof mongoose> | null; connection: typeof mongoose | null } | undefined;
}

const cache = global.mongooseConnection ?? { promise: null, connection: null };
global.mongooseConnection = cache;

export async function connectDB() {
  if (cache.connection) return cache.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  cache.promise ??= mongoose.connect(uri, { bufferCommands: false });
  cache.connection = await cache.promise;
  return cache.connection;
}
