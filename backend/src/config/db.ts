import mongoose from "mongoose";

interface MongooseCatch {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCatch | undefined;
}

let cache = global.mongooseCache;
if (!cache) {
  cache = global.mongooseCache = { conn: null, promise: null };
}

export const connectDb = async (): Promise<typeof mongoose> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    cache.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
};
