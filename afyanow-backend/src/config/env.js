import "dotenv/config";
const required = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];
export function validateEnv() { const missing = required.filter((key) => !process.env[key]); if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`); }
export const env = { port: Number(process.env.PORT || 5000), nodeEnv: process.env.NODE_ENV || "development", frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173", jwtSecret: process.env.JWT_SECRET, jwtRefreshSecret: process.env.JWT_REFRESH_SECRET };
