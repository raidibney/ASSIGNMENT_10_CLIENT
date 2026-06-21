import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// 🟢 Fixed: Removed the TypeScript '!' operator from process.env.MONGO_URI
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DATABASE_NAME);

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user: {
    additionalFields: {
      role: { 
        type: "string",        
        defaultValue: "user",  
      }
    }
  },
});