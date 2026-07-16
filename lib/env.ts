export function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Please define ${key} in .env`);
  }

  return value;
}

export function getApiUrl() {
  return getRequiredEnv("NEXT_PUBLIC_API_URL");
}

export function getMongoUri() {
  return process.env.MONGODB_DIRECT_URI || getRequiredEnv("MONGODB_URI");
}

export function getMongoDbName() {
  return getRequiredEnv("MONGODB_DB_NAME");
}
