/** @type { import("drizzle-kit").Config } */

export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:6zMDTQ0ONinS@ep-young-bonus-a56tbiuf.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
  };