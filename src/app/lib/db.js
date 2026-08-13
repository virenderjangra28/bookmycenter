const username = process.env.username;
const password = process.env.password;

export const connectionString = `mongodb+srv://${username}:${password}@bookmycenter.jdsesiv.mongodb.net/bookmycenter?appName=bookmycenter`