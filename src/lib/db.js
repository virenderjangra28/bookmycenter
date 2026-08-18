import mongoose from "mongoose";

function getConnectionString() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const username = process.env.MONGODB_USERNAME || process.env.username;
  const password = process.env.MONGODB_PASSWORD || process.env.password;

  if (!username || !password) {
    throw new Error(
      "Missing MongoDB credentials. Set MONGODB_URI (recommended) or username/password in environment variables."
    );
  }

  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@bookmycenter.jdsesiv.mongodb.net/bookmycenter?appName=bookmycenter`;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectionString = getConnectionString();

    cached.promise = mongoose.connect(connectionString, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
