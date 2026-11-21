'use strict';

const REQUIRED = [
  'JWT_SECRET',
  'MONGODB_URI',
  'GEMINI_API_KEY',
];

function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
    console.error('[Config] Copy server/.env.example to server/.env and fill in all values.');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('[Config] JWT_SECRET must be at least 32 characters long.');
    process.exit(1);
  }

  console.log('[Config] Environment variables validated ✓');
}

module.exports = { validateEnv };
