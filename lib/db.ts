import mongoose from "mongoose";

type ConnectionCache = {
  promise: Promise<typeof mongoose> | null;
  connection: typeof mongoose | null;
  failedAt: number;
  failureReason: string;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: ConnectionCache | undefined;
}

// When Atlas is unreachable, mongoose waits for the whole server-selection
// window before failing. Without a cooldown every request on a public page
// would pay that penalty again, so a failed attempt is remembered briefly and
// callers fall straight back to the editorial manifest instead.
const FAILURE_COOLDOWN_MS = 15_000;
const DEFAULT_DATABASE = "paperfoundation";

const cache: ConnectionCache = global.mongooseConnection ?? {
  promise: null,
  connection: null,
  failedAt: 0,
  failureReason: "",
};
global.mongooseConnection = cache;

/**
 * An Atlas URI without a path connects to the `test` database, which silently
 * splits production content away from the database the CMS reads. The named
 * database is applied explicitly instead of relying on the URI path.
 */
export function databaseNameFromUri(uri: string) {
  const withoutQuery = uri.split("?")[0];
  const path = withoutQuery.slice(withoutQuery.indexOf("://") + 3);
  const slash = path.indexOf("/");
  if (slash === -1) return DEFAULT_DATABASE;
  const name = path.slice(slash + 1).trim();
  return name || DEFAULT_DATABASE;
}

export function databaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB() {
  if (cache.connection && cache.connection.connection.readyState === 1) return cache.connection;
  if (cache.connection && cache.connection.connection.readyState === 0) {
    cache.connection = null;
    cache.promise = null;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!cache.promise && cache.failedAt && Date.now() - cache.failedAt < FAILURE_COOLDOWN_MS) {
    throw new Error(cache.failureReason || "Database is unavailable");
  }

  cache.promise ??= mongoose
    .connect(uri, {
      dbName: databaseNameFromUri(uri),
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 20_000,
    })
    .then((connection) => {
      cache.failedAt = 0;
      cache.failureReason = "";
      return connection;
    })
    .catch((error: unknown) => {
      cache.promise = null;
      cache.failedAt = Date.now();
      cache.failureReason = error instanceof Error ? error.message : "Database is unavailable";
      throw error;
    });

  cache.connection = await cache.promise;
  return cache.connection;
}

/**
 * Resolves to null instead of throwing, for public read paths that already
 * have an editorial fallback and should never surface a 500.
 */
export async function tryConnectDB() {
  if (!databaseConfigured()) return null;
  try {
    return await connectDB();
  } catch {
    return null;
  }
}

export function lastDatabaseFailure() {
  return cache.failedAt ? { failedAt: cache.failedAt, reason: cache.failureReason } : null;
}
