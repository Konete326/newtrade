require('dotenv').config();
const app = require('./app');
const { connectControlDB } = require('./config/db');
const { seedSuperAdmin } = require('./services/seedService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectControlDB();
    await seedSuperAdmin();
    app.listen(PORT, () => {
      process.stdout.write(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode\n`);
    });
  } catch (error) {
    process.stdout.write(`Failed to start server: ${error.message}\n`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  process.stdout.write(`Unhandled Rejection: ${err.message}\n`);
  process.exit(1);
});
