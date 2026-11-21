'use strict';

const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 5001;

const server = app.listen(PORT, () => {
  console.log(`✓ ResumeIQ server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      console.log('[Server] MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('[Server] Forcing shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled promise rejection:', reason);
});
